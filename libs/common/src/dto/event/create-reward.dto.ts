import { RewardType } from '@libs/database';
import { IsEnum, IsMongoId, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateRewardDto {
    @IsMongoId()
    eventId: string;

    @IsEnum(RewardType)
    rewardType: RewardType;

    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(1)
    amount: number;
}
