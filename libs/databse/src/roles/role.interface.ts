import { Types } from 'mongoose'
import { UserRoleLevel } from "./role.enum";

export interface IRole {
  _id: Types.ObjectId;
  id: string;
  name: UserRoleLevel;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
