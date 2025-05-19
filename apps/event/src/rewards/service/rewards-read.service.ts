import { IResReward, IResRewardList } from '@libs/common';
import { mapEventDoc } from '@libs/database';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RewardsRepository, RewardsRepositoryToken } from '../repository/rewards.repository';

export const RewardsReadServiceToken = 'RewardsReadServiceToken';

@Injectable()
export class RewardsReadService {
    constructor(
        @Inject(RewardsRepositoryToken)
        private readonly rewardsRepository: RewardsRepository,
    ) {}

    async getAllRewards(pageParam: number, limitSize: number): Promise<IResRewardList> {
        const rewards = await this.rewardsRepository.findAll(pageParam, limitSize);

        const items: IResReward[] = rewards.map((reward) => {
            const event = mapEventDoc(Object(reward.eventId));

            return {
                id: reward.id,
                rewardType: reward.rewardType,
                description: reward.description,
                amount: reward.amount,
                event: {
                    id: event.id,
                    title: event.title,
                    status: event.status,
                },
                createdAt: reward.createdAt,
                updatedAt: reward.updatedAt,
            };
        });

        const isLastPage = rewards.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }

    async getRewardByEventId(eventId: string) {
        const reward = await this.rewardsRepository.findByEventId(eventId);
        if (!reward) {
            throw new NotFoundException(`보상이 존재하지 않습니다.`);
        }

        return reward;
    }
}
