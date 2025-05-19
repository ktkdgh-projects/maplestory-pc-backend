import { LoggerMiddleware } from '@libs/common';
import { GlobalConfigModule } from '@libs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { EventsModule } from './events/events.module';
import { RequestsModule } from './requests/requests.module';
import { RewardsModule } from './rewards/rewards.module';

@Module({
    imports: [
        GlobalConfigModule,
        MongooseModule.forRoot(process.env.MONGODB_URI ?? '', { dbName: 'maple-stroy' }),
        EventsModule,
        RewardsModule,
        RequestsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    private readonly isDev: boolean = process.env.MODE === 'dev';

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
        mongoose.set('debug', this.isDev);
    }
}
