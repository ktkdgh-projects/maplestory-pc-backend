import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { AuthServiceProvider, EventServiceProvider } from './service.provider';

@Module({
    imports: [CommonModule, HttpModule],
    controllers: [],
    providers: [AuthServiceProvider, EventServiceProvider],
    exports: [AuthServiceProvider, EventServiceProvider],
})
export class ServiceModule {}
