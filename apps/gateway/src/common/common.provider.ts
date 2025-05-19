import { Provider } from '@nestjs/common';
import { TokenService, TokenServiceToken } from './service/token.service';

export const TokenServiceProvider: Provider = {
    provide: TokenServiceToken,
    useClass: TokenService,
};
