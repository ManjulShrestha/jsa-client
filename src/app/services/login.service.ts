import { EventEmitter, Injectable } from '@angular/core';
import { HttpService } from './http/http.service';
import { User } from '../models/identity/user';

@Injectable()
export class LoginService {

  user: User;

  dataChanged: EventEmitter<string> = new EventEmitter();

  constructor(private http: HttpService) {
  }

  login(user, showLoader) {
    return this.http.post('identity/authenticate', user).then(
      (response) => {
        showLoader = false;
        console.log(response);
        this.dataChanged.emit();
        return response;
      },
      (error) => {
        console.log('No User Found');
        console.log(error);
        return error;
      }
    );

  }

  signUp(user, showLoader) {
    return this.http.post('identity/user', user);
  }

  getUserRoles(id) {
    return this.http.get('identity/' + id + '/roles');
  }

  checkEmailDuplication(email) {
    return this.http.get('identity/username-duplication-check?username=' + email);
  }

  changePassword(user){
    return this.http.put('identity/change-password',user);
  }
}
