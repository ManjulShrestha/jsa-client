import { Component, OnInit } from '@angular/core';
import {OnAuthorized} from '../../common/accessManagement/onAuthorize.model';
import {StorageService} from '../../common/storage/storage.service';
import {CompanyService} from '../../services/company.service';
import {Company} from '../../models/company/company';
import {CompanyPayments} from '../../models/company/companyPayments';
import {Router} from '@angular/router';
import {ToastrManager} from 'ng6-toastr-notifications';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit,OnAuthorized {

  company: Company;
  application:number=0;
  jobsPosted:number=0;
  numberOfJobs:number=0;


  constructor(private storageService : StorageService,
              private router:Router,
              private toastr:ToastrManager,
              private companyService: CompanyService) { }

  ngOnInit() {
    this.populateCompany();
  }

  onAuthorized() {
  }

  populateCompany(){
    let application:number=0;
    this.company=this.storageService.getCompany();
    this.companyService.getLatestCompanyPayment(this.company.id).then((response =>{
      this.company.latestPayment=response;
      this.storageService.storeCompany(this.company);
      this.jobsPosted=this.company.latestPayment.noOfJobPosted;
      this.numberOfJobs=this.company.latestPayment.noOfJobSlots;
    }),(error =>{

    }))
    this.company.jobSet.forEach(function (value) {
      application=application+value.applied;
    });
    let latestPayment= Math.max.apply(Math, this.company.companyPayments.map(function(o) { return o.id; }));
    let latestCompanyPayments:CompanyPayments= new CompanyPayments();
    this.company.companyPayments.forEach(function (value) {
      if(value.id == latestPayment){
        latestCompanyPayments=value;
        return;
      }
    })

    this.application=application;
  }


  postJob(){
    if(this.jobsPosted<this.numberOfJobs || this.numberOfJobs < 0) {
      this.router.navigateByUrl('/company/post-job/0');
    }else{
      this.toastr.infoToastr('Jobs Post limit Exceeded','Subscription Expired !!',{position: 'top-right'})
    }
  }


}
