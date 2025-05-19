import { UserRoleLevel, RoleChangeReason } from '@libs/database';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateUserRoleLogDto {
    @IsMongoId()
    userId: string;

    @IsEnum(UserRoleLevel)
    prevRoleName: UserRoleLevel;

    @IsEnum(UserRoleLevel)
    newRoleName: UserRoleLevel;

    @IsEnum(RoleChangeReason)
    reason: RoleChangeReason;

    @IsOptional()
    @IsString()
    changedBy?: string;
}
