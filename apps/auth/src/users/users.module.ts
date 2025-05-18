import { User, UserSchema } from '@libs/database'
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';
import { UsersController } from './users.controller';
import { SignupServiceProvider, UserProfileServiceProvider, UsersRepositoryProvider } from './users.provider'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        forwardRef(() => AuthModule),
        RolesModule,
    ],
    controllers: [UsersController],
    providers: [
        UsersRepositoryProvider,
        UserProfileServiceProvider,
        SignupServiceProvider
    ],
    exports: [SignupServiceProvider, UserProfileServiceProvider],
})
export class UsersModule {}
