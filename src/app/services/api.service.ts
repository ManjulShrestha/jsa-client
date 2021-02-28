import {EventEmitter, Injectable} from '@angular/core';
import {HttpService} from './http/http.service';

@Injectable()
export class ApiService {

  constructor(private http: HttpService) {
  }


}
