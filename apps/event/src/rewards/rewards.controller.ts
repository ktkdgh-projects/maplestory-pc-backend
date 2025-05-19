import { CreateRewardDto, IResRewardList, UpdateRewardDto } from '@libs/common';
import { Controller, Get, Post, Body, Inject, Query, Patch } from '@nestjs/common';
import { RewardsReadService, RewardsReadServiceToken } from './service/rewards-read.service';
import { RewardsService, RewardsServiceToken } from './service/rewards.service';

@Controller('rewards')
export class RewardsController {
    constructor(
        @Inject(RewardsReadServiceToken)
        private readonly rewardsReadService: RewardsReadService,
        @Inject(RewardsServiceToken)
        private readonly rewardsService: RewardsService,
    ) {}

    @Post()
    async createReward(@Body() createRewardDto: CreateRewardDto): Promise<{ message: string }> {
        return this.rewardsService.createReward(createRewardDto);
    }

    @Get()
    async getAllRewards(@Query('pageParam') pageParam: number): Promise<IResRewardList> {
        return this.rewardsReadService.getAllRewards(pageParam, 10);
    }

    @Patch('update')
    async updateReward(@Body() updateRewardDto: UpdateRewardDto): Promise<{ message: string }> {
        return this.rewardsService.updateReward(updateRewardDto);
    }
}
