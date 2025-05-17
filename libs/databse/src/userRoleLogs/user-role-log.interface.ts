import { Types } from 'mongoose'
import { RoleAction, RoleChangeReason } from "./user-role-log.enum";

export interface IUserRoleLog {
  _id: Types.ObjectId;
  id: string;
  userId: string;
  roleId: string;
  changedBy: string;
  action: RoleAction;
  reason: RoleChangeReason;
  createdAt: Date;
  updatedAt: Date;
}