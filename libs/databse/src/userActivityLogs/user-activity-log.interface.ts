import { Types } from 'mongoose'
import { UserActionType } from "./user-activity-log.enum";

export interface IUserActivityLog {
    _id: Types.ObjectId;
    id: string;
    userId: Types.ObjectId;
    actionType: UserActionType;
    metadata: Map<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}