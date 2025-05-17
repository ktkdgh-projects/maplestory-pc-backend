import { IsString, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class CreateUserRoleDto {
    @IsString()
    userId: string;

    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsString({ each: true })
    roleId: string[];
}
