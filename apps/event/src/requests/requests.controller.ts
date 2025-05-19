import { IResRewardRequestList, IRewardRequestItemList, RewardClaimDto } from '@libs/common';
import { EventConditionType, RewardRequestStatus } from '@libs/database';
import { Controller, Get, Post, Param, Query, Inject, Body } from '@nestjs/common';
import { RewardClaimService, RewardClaimServiceToken } from './service/reward-claim.service';
import { RewardRequestsService, RewardRequestsServiceToken } from './service/reward-requests.service';

@Controller()
export class RequestsController {
    constructor(
        @Inject(RewardClaimServiceToken)
        private readonly rewardClaimService: RewardClaimService,
        @Inject(RewardRequestsServiceToken)
        private readonly rewardRequestsService: RewardRequestsService,
    ) {}

    @Post('events/rewards/claim')
    async claimReward(@Body() dto: RewardClaimDto): Promise<{ message: string }> {
        return this.rewardClaimService.claimReward(dto);
    }

    @Get('rewards/requests/me/:userId')
    async getMyRewardRequests(
        @Param('userId') userId: string,
        @Query('pageParam') pageParam: number,
    ): Promise<IResRewardRequestList> {
        return this.rewardRequestsService.getMyRewardRequests(userId, pageParam, 10);
    }

    @Get('rewards/requests')
    async getAllRewardRequests(
        @Query('pageParam') pageParam: number,
        @Query('status') status?: RewardRequestStatus,
        @Query('conditionType') conditionType?: EventConditionType,
    ): Promise<IRewardRequestItemList> {
        return this.rewardRequestsService.getAllRewardRequests(pageParam, 10, status, conditionType);
    }
}
