import { User, UserSchema } from '@libs/database'
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesModule } from '../roles/roles.module';
import { UsersController } from './users.controller';
import { SingupServiceProvider, UserProfileServiceProvider, UsersRepositoryProvider } from './users.provider'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        RolesModule,
    ],
    controllers: [UsersController],
    providers: [
        UsersRepositoryProvider,
        UserProfileServiceProvider,
        SingupServiceProvider
    ],
    exports: [],
})
export class UsersModule {}
