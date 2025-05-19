import { UserActivityLog, UserActivityLogschema } from '@libs/database';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserActivityLogServiceProvider } from './userActivityLog.providers';
import { UserActivityLogRepository } from './userActivityLog.repository';

@Module({
    imports: [MongooseModule.forFeature([{ name: UserActivityLog.name, schema: UserActivityLogschema }])],
    providers: [UserActivityLogRepository, UserActivityLogServiceProvider],
    exports: [UserActivityLogServiceProvider],
})
export class UserActivityLogModule {}
