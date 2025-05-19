import { Types } from 'mongoose';

export interface IUserReward {
    _id: Types.ObjectId;
    id: string;
    userId: Types.ObjectId;
    eventId: Types.ObjectId;
    rewardId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
