import {EventEmitter, Injectable} from '@angular/core';
import {HttpService} from './http/http.service';
import {User} from '../models/identity/user';
import {Company} from '../models/company/company';
import {Candidate} from '../models/candidate/candidate';
import {CompanyPayments} from '../models/company/companyPayments';

@Injectable()
export class CompanyService {

  user: User;

  dataChanged: EventEmitter<string> = new EventEmitter();

  constructor(private http: HttpService) {
  }

  addCompany(company: Company) {
    return this.http.post('company/', company);
  }

  updateCompany(company: Company){
    return this.http.put('company/', company);
  }

  getCompanyByUser(userId: number){
    return this.http.get('company/user-id/'+userId);
  }

  getCompanyByJob(jobId: number){
    return this.http.get('company/job-id/'+jobId);
  }

  getCompanyById(id: number){
    return this.http.get('company/'+id);
  }

  getCompanies(page:number, size:number){
    return this.http.get('company/?page='+page+'&size='+size);
  }

  getCompanyCount(){
    return this.http.get('company/count');
  }

  followCompany(companyId:number, candidate:Candidate){
    return this.http.post('company/follow/'+companyId,candidate)
  }

  viewCompany(companyId:number, candidate:Candidate){
    return this.http.post('company/view/'+companyId,candidate)
  }

  makePayment(companyPayments:CompanyPayments){
    return this.http.post('company/pay',companyPayments)
  }

  getLatestCompanyPayment(companyId:number){
    return this.http.get('company/latest-payment/'+companyId);
  }
}
