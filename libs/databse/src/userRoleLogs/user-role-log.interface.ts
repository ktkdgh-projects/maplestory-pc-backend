import { Role } from "../roles";
import { User } from "../users";
import { RoleAction, RoleChangeReason } from "./user-role-log.enum";

export interface IUserRoleLog {
  id: string;
  userId: User;
  roleId: Role;
  changedBy: User;
  action: RoleAction;
  reason: RoleChangeReason;
  createdAt: Date;
  updatedAt: Date;
}