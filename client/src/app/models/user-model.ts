import { UserType } from '../enums/user-type';

export class UserModel {
  id?: number;
  firstname?: string;
  lastname?: string;
  telephone?: string;
  address?: string;
  email?: string;
  password?: string;
  repeatPassword?: string;
  type?: UserType;
  verified?: boolean;
  active?: boolean;
  newsletter?: boolean;
}
