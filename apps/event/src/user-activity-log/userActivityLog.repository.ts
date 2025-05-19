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

    async findByUserEventId(userId: string, eventId: string): Promise<IUserActivityLog | null> {
        const log = await this.userActivityLogModel.findOne({ userId, eventId }).exec();
        return log ? mapUserActivityLogDoc(log) : null;
    }

    async count(type: UserActivityType, userId: string): Promise<number> {
        return this.userActivityLogModel.countDocuments({ type, userId }).exec();
    }

    async findLoginByUserId(userId: string): Promise<IUserActivityLog[]> {
        const logs = await this.userActivityLogModel
            .find({ userId, activityType: UserActivityType.LOGIN })
            .sort({ createdAt: -1 });
        return logs.map((log) => mapUserActivityLogDoc(log));
    }
}
