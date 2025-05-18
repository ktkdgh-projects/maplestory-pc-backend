import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { AuthServiceProvider } from './service.provider';

@Module({
    imports: [CommonModule, HttpModule],
    controllers: [],
    providers: [AuthServiceProvider],
    exports: [AuthServiceProvider],
})
export class ServiceModule {}
