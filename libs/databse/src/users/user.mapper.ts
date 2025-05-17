import { IUser } from './user.interface';
import { UserDocument } from './user.schema';

export const mapUserDoc = (doc: UserDocument): IUser => {
  return {
    id: doc._id.toString(),
    email: doc.email,
    password: doc.password,
    nickname: doc.nickname,
    salt: doc.salt,
    refreshtoken: doc.refreshtoken,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};
