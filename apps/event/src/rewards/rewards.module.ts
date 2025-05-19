import { Reward, RewardSchema } from '@libs/database';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from '../events/events.module';
import { RewardsController } from './rewards.controller';
import { RewardsRepositoryProvider, RewardsServiceProvider, RewardsReadServiceProvider } from './rewards.provider';

@Module({
    imports: [MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]), EventsModule],
    controllers: [RewardsController],
    providers: [RewardsRepositoryProvider, RewardsServiceProvider, RewardsReadServiceProvider],
    exports: [RewardsServiceProvider, RewardsReadServiceProvider],
})
export class RewardsModule {}
