import { RewardRequestReason, RewardRequestStatus } from '@libs/database';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class RewardClaimDto {
    @IsMongoId()
    @IsNotEmpty()
    userId: string;

    @IsMongoId()
    @IsNotEmpty()
    eventId: string;

    @IsOptional()
    @IsEnum(RewardRequestStatus)
    status?: RewardRequestStatus;

    @IsOptional()
    @IsEnum(RewardRequestReason)
    reason?: RewardRequestReason;
}
