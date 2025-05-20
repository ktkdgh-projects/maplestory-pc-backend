import { Types } from 'mongoose';
import { RewardType } from './reward.enum';

export interface IReward {
    _id: Types.ObjectId;
    id: string;
    eventId: Types.ObjectId;
    rewardType: RewardType;
    description: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
}
