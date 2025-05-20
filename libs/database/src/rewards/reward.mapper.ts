import { IReward } from './reward.interface';
import { RewardDocument } from './reward.schema';

export const mapRewardDoc = (doc: RewardDocument): IReward => {
    return {
        _id: doc._id,
        id: doc._id.toString(),
        eventId: doc.eventId,
        rewardType: doc.rewardType,
        description: doc.description,
        amount: doc.amount,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
};
