import { Provider } from '@nestjs/common';
import { AuthService, AuthServiceToken } from './auth/auth.service';

export const AuthServiceProvider: Provider = {
    provide: AuthServiceToken,
    useClass: AuthService,
}
