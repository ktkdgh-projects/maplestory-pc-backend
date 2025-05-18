import { Provider } from '@nestjs/common';
import { Pbkdf2Service, Pbkdf2ServiceToken } from './service/pbkdf2.service';
import { RefreshService, RefreshServiceToken } from './service/refresh.service';
import { SigninService, SigninServiceToken } from './service/signin.service';
import { SignoutService, SignoutServiceToken } from './service/signout.service';
import { TokenService, TokenServiceToken } from './service/token.service';

export const TokenServiceProvider: Provider = {
    provide: TokenServiceToken,
    useClass: TokenService,
}

export const SigninServiceProvider: Provider = {
    provide: SigninServiceToken,
    useClass: SigninService,
}

export const SingoutServiceProvider: Provider = {
    provide: SignoutServiceToken,
    useClass: SignoutService
}

export const RefreshServiceProvider: Provider = {
    provide: RefreshServiceToken,
    useClass: RefreshService
}

export const Pbkdf2ServiceProvider: Provider = {
    provide: Pbkdf2ServiceToken,
    useClass: Pbkdf2Service
}