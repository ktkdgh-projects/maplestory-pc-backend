import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SignupDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    nickname: string;

    @IsString()
    @IsOptional()
    passwordSalt?: string;
}
