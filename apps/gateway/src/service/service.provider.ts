import { Provider } from '@nestjs/common';
import { AuthService, AuthServiceToken } from './auth/auth.service';
import { EventService, EventServiceToken } from './event/event.service';

export const AuthServiceProvider: Provider = {
    provide: AuthServiceToken,
    useClass: AuthService,
};

export const EventServiceProvider: Provider = {
    provide: EventServiceToken,
    useClass: EventService,
};
