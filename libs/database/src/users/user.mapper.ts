import { IUser } from './user.interface';
import { UserDocument } from './user.schema';

export const mapUserDoc = (doc: UserDocument): IUser => {
    return {
        _id: doc._id,
        id: doc._id.toString(),
        email: doc.email,
        password: doc.password,
        passwordSalt: doc.passwordSalt,
        nickname: doc.nickname,
        refreshToken: doc.refreshToken,
        refreshTokenSalt: doc.refreshTokenSalt,
        inviteCode: doc.inviteCode,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
};
