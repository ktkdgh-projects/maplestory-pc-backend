import { SignupDto } from '@libs/common';
import { IUserActivityLog, UserActivityLog, UserActivityLogDocument, mapUserActivityLogDoc } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';

export const UserActivityLogRepositoryToken = 'UserActivityLogRepositoryToken';

@Injectable()
export class UserActivityLogRepository {
    constructor(
        @InjectModel(UserActivityLog.name)
        private readonly userActivityLogModel: Model<UserActivityLogDocument>,
    ) {}

    async createUser(logData: SignupDto, session?: ClientSession): Promise<IUserActivityLog> {
        const log = new this.userActivityLogModel({ ...logData });
        const savedLog = await log.save({ session });
        return mapUserActivityLogDoc(savedLog);
    }
}
