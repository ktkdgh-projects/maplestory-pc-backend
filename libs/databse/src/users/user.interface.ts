export interface IUser {
  id: string;
  email: string;
  password: string;
  nickname: string;
  salt: string;
  refreshtoken: string;
  createdAt: Date;
  updatedAt: Date;
}
