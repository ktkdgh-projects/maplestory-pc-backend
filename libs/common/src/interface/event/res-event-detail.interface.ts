import { EventStatus, EventConditionType } from '@libs/database';

export interface IResEventDetail {
    id: string;
    title: string;
    description: string;
    conditionParams: {
        type: EventConditionType;
        days: number;
    };
    startAt: Date;
    endAt: Date;
    status: EventStatus;
}
