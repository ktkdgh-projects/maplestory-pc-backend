import { Types } from 'mongoose'

export interface IUser {  
  _id: Types.ObjectId;
  id: string;
  email: string;
  password: string;
  nickname: string;
  refreshtoken: string;
  createdAt: Date;
  updatedAt: Date;
}
