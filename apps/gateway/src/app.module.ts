import { LoggerMiddleware } from '@libs/common';
import { GlobalConfigModule } from '@libs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { ServiceModule } from './service/service.module';

@Module({
    imports: [GlobalConfigModule, CommonModule, ServiceModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
