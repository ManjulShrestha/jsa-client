import {UserType} from '../metadata/userType';
import {EmbeddedName} from './embeddedName';

export class User {
  id: number ;
  nameEnglish: EmbeddedName = new EmbeddedName();
  userName: string;
  password: string;
  active: boolean;
  contactNo: string;
  email: string;
  uuId: string;
  loginAttempt: number;
  firstTimeLogin: boolean;
  userType: UserType;
  token: string;
  newPassword: string;
}

