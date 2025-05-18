import { Types } from 'mongoose'

export interface IUserRole {
  _id: Types.ObjectId;
  id: string;
  userId: Types.ObjectId;
  roleId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
