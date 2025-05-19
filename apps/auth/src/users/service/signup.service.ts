import { SignupDto, Transactional } from '@libs/common';
import { UserActivityType } from '@libs/database';
import { BadRequestException, InternalServerErrorException, Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';
import { Pbkdf2Service, Pbkdf2ServiceToken } from '../../auth/service/pbkdf2.service';
import { UserRolesService, UserRolesServiceToken } from '../../roles/service/user-roles.service';
import { UserActivityLogService, UserActivityLogServiceToken } from '../../user-activity-log/userActivityLog.service';
import { UsersRepository, UsersRepositoryToken } from '../repository/users.repository';

export const SignupServiceToken = 'SignupServiceToken';

@Injectable()
export class SignupService {
    constructor(
        @InjectConnection()
        private readonly connection: Connection,

        @Inject(UsersRepositoryToken)
        private readonly usersRepository: UsersRepository,
        @Inject(UserRolesServiceToken)
        private readonly userRolesService: UserRolesService,
        @Inject(Pbkdf2ServiceToken)
        private readonly pbkdf2Service: Pbkdf2Service,

        @Inject(UserActivityLogServiceToken)
        private readonly userActivityLogService: UserActivityLogService,
    ) {}

    @Transactional()
    async signupUser(signupDto: SignupDto, session?: ClientSession): Promise<{ message: string }> {
        const { email, nickname, password, inviteCode } = signupDto;
        let newUser;

        const exists = await this.usersRepository.findByEmailOrNickname(email, nickname);
        if (exists) {
            throw new BadRequestException('이미 사용 중인 이메일 또는 닉네임입니다.');
        }

        try {
            const { salt, encryptedData } = this.pbkdf2Service.encryptPBKDF2(password);
            newUser = await this.usersRepository.createUser(
                {
                    ...signupDto,
                    password: encryptedData,
                    passwordSalt: salt,
                    inviteCode: this.generateInviteCode(),
                },
                session,
            );
        } catch (error) {
            throw new InternalServerErrorException('회원가입 중 오류가 발생했습니다.');
        }

        await this.userRolesService.assignUserRole(newUser.id, session);
        if (inviteCode) {
            const inviter = await this.usersRepository.findByInviteCode(inviteCode);
            if (inviter) {
                await this.userActivityLogService.signupActivityLog({
                    userId: inviter.id,
                    activityType: UserActivityType.INVITE,
                });
            }
        }
        return { message: '회원가입 완료' };
    }

    private generateInviteCode(length = 10): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            result += chars[randomIndex];
        }
        return result;
    }
}
