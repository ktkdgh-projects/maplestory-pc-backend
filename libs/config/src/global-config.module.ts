import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { configs } from './configs';

export const GlobalConfigModule = ConfigModule.forRoot({
    cache: true,
    isGlobal: true,
    envFilePath: path.resolve(__dirname, '../../../../.env'),
    load: [configs],
});