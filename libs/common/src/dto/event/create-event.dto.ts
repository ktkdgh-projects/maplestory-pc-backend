import { EventConditionType, EventStatus } from '@libs/database';
import { Type } from 'class-transformer';
import {
    IsString,
    IsDateString,
    IsEnum,
    IsNotEmpty,
    ValidateIf,
    IsInt,
    Min,
    IsOptional,
    ValidateNested,
} from 'class-validator';

export class LoginDaysParamsDto {
    @IsInt()
    @Min(1)
    days: number;
}

export class InviteUsersParamsDto {
    @IsInt()
    @Min(1)
    users: number;
}

export class DetailViewsParamsDto {
    @IsInt()
    @Min(1)
    views: number;
}

export class ParticipationTimesParamsDto {
    @IsInt()
    @Min(1)
    times: number;
}

export class ConditionParamsDto {
    @ValidateIf((o) => o.type === EventConditionType.LOGIN_N_DAYS)
    @IsInt()
    @Min(1)
    days?: number;

    @ValidateIf((o) => o.type === EventConditionType.INVITE_N_USERS)
    @IsInt()
    @Min(1)
    users?: number;

    @ValidateIf((o) => o.type === EventConditionType.EVENT_DETAIL_VIEWS)
    @IsInt()
    @Min(1)
    views?: number;

    @ValidateIf((o) => o.type === EventConditionType.EVENT_PARTICIPATION_COUNT)
    @IsInt()
    @Min(1)
    times?: number;

    @IsEnum(EventConditionType)
    type: EventConditionType;
}

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    startAt: string;

    @IsDateString()
    endAt: string;

    @IsOptional()
    @IsEnum(EventStatus)
    status?: EventStatus;

    @ValidateNested()
    @Type(() => ConditionParamsDto)
    conditionParams: ConditionParamsDto;
}
