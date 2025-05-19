import { IUserReward, mapUserRewardDoc, UserReward, UserRewardDocument } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export const UserRewardsRepositoryToken = 'UserRewardsRepositoryToken';

@Injectable()
export class UserRewardsRepository {
    constructor(
        @InjectModel(UserReward.name)
        private readonly userRewardsModel: Model<UserRewardDocument>,
    ) {}

    async createUserReward(userId: string, eventId: string, rewardId: string): Promise<IUserReward> {
        const reward = new this.userRewardsModel({ userId, eventId, rewardId });
        const savedRReward = await reward.save();
        return mapUserRewardDoc(savedRReward);
    }
}
