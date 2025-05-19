import { Event, EventSchema } from '@libs/database';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserActivityLogModule } from '../user-activity-log/userActivityLog.module';
import { EventsController } from './events.controller';
import { EventsManageServiceProvider, EventsRepositoryProvider, EventsReadServiceProvider } from './events.provider';

@Module({
    imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]), UserActivityLogModule],
    controllers: [EventsController],
    providers: [EventsRepositoryProvider, EventsManageServiceProvider, EventsReadServiceProvider],
    exports: [EventsManageServiceProvider, EventsReadServiceProvider],
})
export class EventsModule {}
