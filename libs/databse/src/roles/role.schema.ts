import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { getCurrentDate } from '../utils/time';
import { UserRoleLevel } from './role.enum';

export type RoleDocument = Role & Document;

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class Role {
    @Prop({ required: true, type: String, enum: UserRoleLevel })
    name: UserRoleLevel;

    @Prop({ required: true, type: SchemaTypes.String })
    description: string;

    createdAt: Date;
    updatedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
