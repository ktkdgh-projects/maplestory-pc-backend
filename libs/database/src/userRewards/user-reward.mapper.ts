import { IUserReward } from './user-reward.interface';
import { UserRewardDocument } from './user-reward.schema';

export const mapUserRewardDoc = (doc: UserRewardDocument): IUserReward => {
    return {
        _id: doc._id,
        id: doc._id.toString(),
        userId: doc.userId,
        eventId: doc.eventId,
        rewardId: doc.rewardId,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
};
