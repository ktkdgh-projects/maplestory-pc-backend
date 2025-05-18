import { UserRoleLevel, RoleChangeReason } from '@libs/database';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ManageUserRolesDto {
    @IsString()
    userId: string;

    @IsEnum(UserRoleLevel)
    newRoleName: UserRoleLevel;

    @IsEnum(RoleChangeReason)
    reason: RoleChangeReason;

    @IsOptional()
    @IsString()
    changedBy?: string;
}
