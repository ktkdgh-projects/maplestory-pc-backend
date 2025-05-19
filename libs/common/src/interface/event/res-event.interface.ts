import { EventStatus } from '@libs/database';

export interface IResEvent {
    id: string;
    title: string;
    description: string;
    status: EventStatus;
}

export interface IResEventList {
    items: IResEvent[];
    nextPage?: number;
}
