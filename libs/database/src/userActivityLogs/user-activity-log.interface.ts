import { Types } from 'mongoose';
import { UserActivityType } from './user-activity-log.enum';

export interface IUserActivityLog {
    _id: Types.ObjectId;
    id: string;
    userId: Types.ObjectId;
    activityType: UserActivityType;
    eventId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
