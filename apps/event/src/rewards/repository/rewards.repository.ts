import { CreateRewardDto, UpdateEventDto } from '@libs/common';
import { IReward, mapRewardDoc, Reward, RewardDocument } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export const RewardsRepositoryToken = 'RewardsRepositoryToken';

@Injectable()
export class RewardsRepository {
    constructor(
        @InjectModel(Reward.name)
        private readonly rewardModel: Model<RewardDocument>,
    ) {}

    async createReward(dto: CreateRewardDto): Promise<IReward> {
        const reward = new this.rewardModel({ ...dto });
        const savedReward = await reward.save();
        return mapRewardDoc(savedReward);
    }

    async findById(_id: string): Promise<IReward | null> {
        const reward = await this.rewardModel.findOne({ _id }).exec();
        return reward ? mapRewardDoc(reward) : null;
    }

    async findByEventId(_id: string): Promise<IReward | null> {
        const reward = await this.rewardModel.findOne({ eventId: _id }).exec();
        return reward ? mapRewardDoc(reward) : null;
    }

    async findAll(pageParam: number, limitSize: number): Promise<IReward[]> {
        const rewards = await this.rewardModel
            .find()
            .populate('eventId')
            .skip(pageParam * limitSize)
            .limit(limitSize)
            .exec();

        return rewards.map((reward) => mapRewardDoc(reward));
    }

    async updateReward(_id: string, updateEventDto: UpdateEventDto): Promise<number> {
        const response = await this.rewardModel.updateOne({ _id }, { $set: { ...updateEventDto } }).exec();
        return response.matchedCount;
    }
}
