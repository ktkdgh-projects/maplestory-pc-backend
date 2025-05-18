import { UserRoleLevel, RoleChangeReason } from '@libs/database';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateUserRoleLogDto {
    @IsString()
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
