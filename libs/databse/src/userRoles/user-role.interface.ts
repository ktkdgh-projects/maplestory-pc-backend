import { Types } from 'mongoose'

export interface IUserRole {
  _id: Types.ObjectId;
  id: string;
  userId: string;
  roleId: string[];
  createdAt: Date;
  updatedAt: Date;
}
