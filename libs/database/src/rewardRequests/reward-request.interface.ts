import { Types } from 'mongoose';
import { RewardRequestStatus, RewardRequestReason } from './reward-request.enum';

export interface IRewardRequest {
    _id: Types.ObjectId;
    id: string;
    userId: Types.ObjectId;
    eventId: Types.ObjectId;
    status: RewardRequestStatus;
    reason: RewardRequestReason;
    createdAt: Date;
    updatedAt: Date;
}
