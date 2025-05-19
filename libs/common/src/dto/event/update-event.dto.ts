import { EventStatus } from '@libs/database';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsOptional, IsEnum, IsString, IsDateString, ValidateNested } from 'class-validator';
import { CreateEventDto, ConditionParamsDto } from './create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDateString()
    startAt?: string;

    @IsOptional()
    @IsDateString()
    endAt?: string;

    @IsOptional()
    @IsEnum(EventStatus)
    status?: EventStatus;

    @IsOptional()
    @ValidateNested()
    @Type(() => ConditionParamsDto)
    conditionParams?: ConditionParamsDto;
}
