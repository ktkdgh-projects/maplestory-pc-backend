import {
    IUserActivityLog,
    UserActivityLog,
    UserActivityLogDocument,
    UserActivityType,
    mapUserActivityLogDoc,
} from '@libs/database';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserActivityLogDto } from 'libs/common/dist';
import { Model } from 'mongoose';

@Injectable()
export class UserActivityLogRepository {
    constructor(
        @InjectModel(UserActivityLog.name)
        private readonly userActivityLogModel: Model<UserActivityLogDocument>,
    ) {}

    async createUserActivityLog(logDTO: UserActivityLogDto) {
        const userActivityLog = new this.userActivityLogModel(logDTO);
        const savedUserActivityLog = await userActivityLog.save();
        return mapUserActivityLogDoc(savedUserActivityLog);
    }

    async findByUserId(userId: string): Promise<IUserActivityLog | null> {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const log = await this.userActivityLogModel
            .findOne({
                userId,
                activityType: UserActivityType.LOGIN,
                createdAt: { $gte: startOfDay, $lte: endOfDay },
            })
            .exec();

        return log ? mapUserActivityLogDoc(log) : null;
    }
}
