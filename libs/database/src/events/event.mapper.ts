import { IEvent } from './event.interface';
import { EventDocument } from './event.schema';

export const mapEventDoc = (doc: EventDocument): IEvent => {
    return {
        _id: doc._id,
        id: doc._id.toString(),
        title: doc.title,
        description: doc.description,
        conditionParams: doc.conditionParams,
        startAt: doc.startAt,
        endAt: doc.endAt,
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
};
