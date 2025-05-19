import { EventStatus, RewardRequestReason, RewardRequestStatus } from '@libs/database';

export interface IResRewardRequest {
    requestId: string;
    event: {
        eventId: string;
        title: string;
        status: EventStatus;
        description: string;
    };
    reason: RewardRequestReason;
    status: RewardRequestStatus;
}

export interface IResRewardRequestList {
    items: IResRewardRequest[];
    nextPage?: number;
}
