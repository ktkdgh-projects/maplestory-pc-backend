import { CreateRewardDto, UpdateRewardDto } from '@libs/common';
import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { RewardsRepository, RewardsRepositoryToken } from '../repository/rewards.repository';

export const RewardsServiceToken = 'RewardsServiceToken';

@Injectable()
export class RewardsService {
    constructor(
        @Inject(RewardsRepositoryToken)
        private readonly rewardsRepository: RewardsRepository,
    ) {}

    async createReward(createRewardDto: CreateRewardDto): Promise<{ message: string }> {
        const { eventId } = createRewardDto;

        const reward = await this.rewardsRepository.findByEventId(eventId);
        if (reward) {
            throw new ConflictException('이미 이 이벤트에는 보상이 등록되어 있습니다.');
        }

        await this.rewardsRepository.createReward(createRewardDto);
        return { message: '이벤트 보상 등록 완료' };
    }

    async updateReward(updateRewardDto: UpdateRewardDto): Promise<{ message: string }> {
        const reward = await this.rewardsRepository.findById(updateRewardDto.rewardId);
        if (!reward) {
            throw new NotFoundException('보상 정보를 찾지 못했습니다.');
        }

        const result = await this.rewardsRepository.updateReward(updateRewardDto.rewardId, updateRewardDto);
        if (result === 0) {
            throw new InternalServerErrorException('이벤트 변경에 실패했습니다');
        }

        return { message: '이벤트가 성공적으로 수정되었습니다.' };
    }
}
