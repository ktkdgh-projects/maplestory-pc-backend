import { UserReward, UserRewardSchema, RewardRequest, RewardRequestSchema } from '@libs/database';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from '../events/events.module';
import { RewardsModule } from '../rewards/rewards.module';
import { UserActivityLogModule } from '../user-activity-log/userActivityLog.module';
import { RequestsController } from './requests.controller';
import {
    RewardRequestsRepositoryProvider,
    UserRewardsRepositoryProvider,
    RewardClaimServiceProvider,
    RewardRequestsServiceProvider,
} from './requests.provider';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: UserReward.name, schema: UserRewardSchema }]),
        MongooseModule.forFeature([{ name: RewardRequest.name, schema: RewardRequestSchema }]),
        EventsModule,
        UserActivityLogModule,
        RewardsModule,
    ],
    controllers: [RequestsController],
    providers: [
        RewardRequestsRepositoryProvider,
        UserRewardsRepositoryProvider,
        RewardClaimServiceProvider,
        RewardRequestsServiceProvider,
    ],
    exports: [RewardClaimServiceProvider, RewardRequestsServiceProvider],
})
export class RequestsModule {}
