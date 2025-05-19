import { EventStatus, RewardType } from '@libs/database';

export interface IResReward {
    id: string;
    rewardType: RewardType;
    description: string;
    amount: number;
    event: {
        id: string;
        title: string;
        status: EventStatus;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface IResRewardList {
    items: IResReward[];
    nextPage?: number;
}
