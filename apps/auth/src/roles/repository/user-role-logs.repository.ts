import { CreateUserRoleLogDto } from '@libs/common';
import { IUserRoleLog, UserRoleLog, UserRoleLogDocument, mapUserRoleLogDoc } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';

export const UserRoleLogsRepositoryToken = 'UserRoleLogsRepositoryToken';

@Injectable()
export class UserRoleLogsRepository {
    constructor(
        @InjectModel(UserRoleLog.name) 
        private readonly userRoleLogsModel: Model<UserRoleLogDocument>,
    ) {}

    async createUserRoleLog(dto: CreateUserRoleLogDto, session?: ClientSession): Promise<IUserRoleLog> {
        const log = new this.userRoleLogsModel({ ...dto });
        const savedLog = await log.save({ session });
        return mapUserRoleLogDoc(savedLog)
    }

    async findRoleLogsByDateRange(from: Date, to: Date, pageParam: number, limitSize: number): Promise<IUserRoleLog[]> {
        const logs = await this.userRoleLogsModel
            .find({ createdAt: { $gte: from, $lte: to }})
            .populate('userId')
            .populate('changedBy')
            .sort({ createdAt: -1 }) 
            .skip(pageParam * limitSize)
            .limit(limitSize)
            .exec();

        return logs.map((log) => mapUserRoleLogDoc(log))
    }
}
