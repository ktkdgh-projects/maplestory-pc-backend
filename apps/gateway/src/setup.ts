import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import passport from 'passport';

export const setup = (app: NestExpressApplication) => {
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    app.useGlobalPipes(new ValidationPipe());
    app.use(passport.initialize());
}
