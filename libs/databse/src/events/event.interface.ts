import { Types } from 'mongoose'
import { EventConditionType, EventStatus } from "./event.enum";

export interface IEvent {
    _id: Types.ObjectId;
    id: string;
    title: string;
    description: string;
    condition: EventConditionType;
    conditionParams?: Map<string, unknown>;
    startAt: Date;
    endAt: Date;
    status: EventStatus;
    createdAt: Date;
    updatedAt: Date;
}