import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from '../roles/roles.module';
import { UserActivityLogModule } from '../user-activity-log/userActivityLog.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import {
    SigninServiceProvider,
    TokenServiceProvider,
    RefreshServiceProvider,
    Pbkdf2ServiceProvider,
    SingoutServiceProvider,
} from './auth.provicer';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { algorithm: 'HS512' },
            verifyOptions: { algorithms: ['HS512'] },
        }),
        UsersModule,
        RolesModule,
        UserActivityLogModule,
    ],
    controllers: [AuthController],
    providers: [
        SigninServiceProvider,
        SingoutServiceProvider,
        TokenServiceProvider,
        RefreshServiceProvider,
        Pbkdf2ServiceProvider,
    ],
    exports: [
        SigninServiceProvider,
        SingoutServiceProvider,
        TokenServiceProvider,
        RefreshServiceProvider,
        Pbkdf2ServiceProvider,
    ],
})
export class AuthModule {}
