import { Types } from 'mongoose'
import { UserRoleLevel } from '../roles';
import { RoleChangeReason } from "./user-role-log.enum";

export interface IUserRoleLog {
  _id: Types.ObjectId;
  id: string;
  userId: Types.ObjectId;
  prevRoleName: UserRoleLevel;
  newRoleName: UserRoleLevel;
  changedBy: Types.ObjectId;
  reason: RoleChangeReason;
  createdAt: Date;
  updatedAt: Date;
}