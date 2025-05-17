import { SignupDto, Transactional } from '@libs/common'
import { BadRequestException, InternalServerErrorException, Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { ClientSession, Connection } from 'mongoose';
import { UserRolesService, UserRolesServiceToken } from '../../roles/service/user-roles.service';
import { UsersRepository, UsersRepositoryToken } from '../repository/users.repository';

export const SingupServiceToken = 'SingupServiceToken';

@Injectable()
export class SingupService {
    constructor(
        @InjectConnection() 
        private readonly connection: Connection,

        @Inject(UsersRepositoryToken)
        private readonly usersRepository: UsersRepository,
        @Inject(UserRolesServiceToken)
        private readonly userRolesService: UserRolesService
    ) {}

    @Transactional()
    async signupUser(signupDto: SignupDto, session?: ClientSession): Promise<{ message: string }> {
        const { email, nickname, password } = signupDto;
        let newUser;

        const exists = await this.usersRepository.findByEmailOrNickname(email, nickname);
        if (exists) { 
            throw new BadRequestException('이미 사용 중인 이메일 또는 닉네임입니다.');
        }

        try {
            const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());
            newUser = await this.usersRepository.createUser({ ...signupDto, password: hashedPassword }, session);
        } catch (error) {
            throw new InternalServerErrorException('회원가입 중 오류가 발생했습니다.');
        }

        await this.userRolesService.assignUserRole(newUser.id, session)     

        return { message: '회원가입 완료' };
    }
}
