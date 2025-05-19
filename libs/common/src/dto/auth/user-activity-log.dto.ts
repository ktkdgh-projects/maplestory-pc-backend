import { UserActivityType } from '@libs/database';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';

export class UserActivityLogDto {
    @IsMongoId()
    userId: string;

    @IsEnum(UserActivityType)
    activityType: UserActivityType;

    @IsOptional()
    @IsMongoId()
    eventId?: string;
}
