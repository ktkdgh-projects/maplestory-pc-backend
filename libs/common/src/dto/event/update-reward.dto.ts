import { RewardType } from '@libs/database';
import { IsNotEmpty, IsEnum, IsNumber, IsOptional, IsMongoId, IsString } from 'class-validator';

export class UpdateRewardDto {
    @IsMongoId()
    @IsNotEmpty()
    rewardId: string;

    @IsEnum(RewardType)
    @IsOptional()
    rewardType?: RewardType;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    amount?: number;
}
