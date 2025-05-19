import { RewardRequestStatus, RewardRequestReason, EventConditionType } from '@libs/database';

export interface IRewardRequestItem {
    _id: string;
    userId: string;
    status: RewardRequestStatus;
    reason: RewardRequestReason;
    createdAt: string;
    event: {
        _id: string;
        title: string;
        conditionParams: {
            type: EventConditionType;
            days: number;
        };
    };
    user: {
        nickname: string;
    };
}

export interface IRewardRequestItemList {
    items: IRewardRequestItem[];
    nextPage?: number;
}
