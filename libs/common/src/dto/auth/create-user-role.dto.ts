import { IsMongoId } from 'class-validator';

export class CreateUserRoleDto {
    @IsMongoId()
    userId: string;

    @IsMongoId()
    roleId: string;
}
