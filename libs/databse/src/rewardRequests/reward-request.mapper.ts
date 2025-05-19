import { IRewardRequest } from './reward-request.interface';
import { RewardRequestDocument } from './reward-request.schema';

export const mapRewardRequestDoc = (doc: RewardRequestDocument): IRewardRequest => {
    return {
        _id: doc._id,
        id: doc._id.toString(),
        userId: doc.userId,
        eventId: doc.eventId,
        status: doc.status,
        reason: doc.reason,
        processedAt: doc.processedAt,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
};
