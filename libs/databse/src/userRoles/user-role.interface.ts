import { Role } from "../roles";
import { User } from "../users";

export interface IUserRole {
  id: string;
  userId: User;
  roleId: Role;
  createdAt: Date;
  updatedAt: Date;
}
