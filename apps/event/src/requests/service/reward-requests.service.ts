import { IResRewardRequest, IResRewardRequestList, IRewardRequestItemList } from '@libs/common';
import { mapEventDoc, EventConditionType, RewardRequestStatus } from '@libs/database';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { RewardRequestsRepository, RewardRequestsRepositoryToken } from '../repository/reward-requests.repository';

export const RewardRequestsServiceToken = 'RewardRequestsServiceToken';

@Injectable()
export class RewardRequestsService {
    constructor(
        @Inject(RewardRequestsRepositoryToken)
        private readonly rewardRequestsRepository: RewardRequestsRepository,
    ) {}

    async getMyRewardRequests(userId: string, pageParam: number, limitSize: number): Promise<IResRewardRequestList> {
        if (!isValidObjectId(userId)) {
            throw new BadRequestException('유효하지 않은 ObjectId 형식입니다.');
        }

        const requests = await this.rewardRequestsRepository.findByUserId(userId, pageParam, limitSize);
        const items: IResRewardRequest[] = requests.map((request) => {
            const event = mapEventDoc(Object(request.eventId));
            return {
                requestId: request.id,
                event: {
                    eventId: event.id,
                    title: event.title,
                    status: event.status,
                    description: event.description,
                },
                reason: request.reason,
                status: request.status,
            };
        });

        const isLastPage = requests.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }

    async getAllRewardRequests(
        pageParam: number,
        limitSize: number,
        status?: RewardRequestStatus,
        conditionType?: EventConditionType,
    ): Promise<IRewardRequestItemList> {
        const requests = await this.rewardRequestsRepository.findAllWithFilters(pageParam, limitSize, status, conditionType);

        const isLastPage = requests.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items: requests, nextPage };
    }
}
