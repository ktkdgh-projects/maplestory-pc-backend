import { Types } from 'mongoose';

export interface IUser {
    _id: Types.ObjectId;
    id: string;
    email: string;
    password: string;
    passwordSalt: string;
    nickname: string;
    refreshToken: string;
    refreshTokenSalt: string;
    inviteCode?: string;
    createdAt: Date;
    updatedAt: Date;
}
