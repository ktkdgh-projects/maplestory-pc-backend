import { UserRoleLevel, RoleChangeReason } from '@libs/database';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';

export class ManageUserRolesDto {
    @IsMongoId()
    userId: string;

    @IsEnum(UserRoleLevel)
    newRoleName: UserRoleLevel;

    @IsEnum(RoleChangeReason)
    reason: RoleChangeReason;

    @IsOptional()
    @IsString()
    changedBy?: string;
}
