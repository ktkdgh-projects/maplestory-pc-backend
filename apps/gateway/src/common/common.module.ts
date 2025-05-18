import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TokenServiceProvider } from './common.provider';
import { RoleGuard } from './guards/role.guard';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { algorithm: 'HS512' },
            verifyOptions: { algorithms: ['HS512']},
        }),
    ],
    controllers: [],
    providers: [TokenServiceProvider, Reflector, RoleGuard],
    exports: [TokenServiceProvider, RoleGuard],
})
export class CommonModule {}
