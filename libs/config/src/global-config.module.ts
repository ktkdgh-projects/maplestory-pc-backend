import { ConfigModule } from '@nestjs/config';
import { configs } from './configs';

export const GlobalConfigModule = ConfigModule.forRoot({
    cache: true,
    isGlobal: true,
    envFilePath: `${process.cwd()}/.env`,
    load: [configs],
});
