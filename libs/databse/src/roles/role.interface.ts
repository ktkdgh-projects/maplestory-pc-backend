import { UserRoleLevel } from "./role.enum";

export interface IRole {
  id: string;
  name: UserRoleLevel[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
