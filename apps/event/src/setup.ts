import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

export const setup = (app: NestExpressApplication) => {
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    app.useGlobalPipes(new ValidationPipe());

    const whitelist = ['http://localhost:3000'];
    app.enableCors({ origin: whitelist, credentials: true });
};
