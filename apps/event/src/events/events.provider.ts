import { Provider } from '@nestjs/common';
import { EventsRepository, EventsRepositoryToken } from './repository/events.repository';
import { EventsManageService, EventsManageServiceToken } from './service/events-manage.service';
import { EventsReadService, EventsReadServiceToken } from './service/events-read.service';

export const EventsRepositoryProvider: Provider = {
    provide: EventsRepositoryToken,
    useClass: EventsRepository,
};

export const EventsManageServiceProvider: Provider = {
    provide: EventsManageServiceToken,
    useClass: EventsManageService,
};

export const EventsReadServiceProvider: Provider = {
    provide: EventsReadServiceToken,
    useClass: EventsReadService,
};
