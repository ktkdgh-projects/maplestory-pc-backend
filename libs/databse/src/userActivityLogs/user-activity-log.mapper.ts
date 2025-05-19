import { IUserActivityLog } from './user-activity-log.interface';
import { UserActivityLogDocument } from './user-activity-log.schema';

export const mapUserActivityLogDoc = (doc: UserActivityLogDocument): IUserActivityLog => {
    return {
        _id: doc._id,
        id: doc._id.toString(),
        userId: doc.userId,
        actionType: doc.actionType,
        metadata: doc.metadata,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
};
