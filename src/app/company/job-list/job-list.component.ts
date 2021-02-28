import {Component, EventEmitter, OnInit} from '@angular/core';
import {Company} from '../../models/company/company';
import {StorageService} from '../../common/storage/storage.service';
import {OnAuthorized} from '../../common/accessManagement/onAuthorize.model';
import {JobService} from '../../services/job.service';
import {Toastr, ToastrManager} from 'ng6-toastr-notifications';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit,OnAuthorized {

  company: Company;
  activeJobs:number;
  jobs:number;
  application:number;


  constructor(private storageService:StorageService,
              private jobService:JobService,
              private toast:ToastrManager) { }

  ngOnInit() {
    this.company=this.storageService.getCompany();
    let activeJobs:number=0;
    let jobs:number=0;
    let application:number=0;
    this.company.jobSet.forEach(function (value) {
      application=application+value.applied;
      if(!value.deleted){
        jobs++;
        if(value.active){
          activeJobs++;
        }
      }
    })
    this.activeJobs=activeJobs;
    this.jobs=jobs;
    this.application=application;


  }

  onAuthorized() {
  }

  deleteJob(job){
    job.deleted=true;
    let company : Company=new Company();
    company.id=this.company.id;
    job.company=company;
    this.jobService.updateJob(job).then((response =>{
      const  index: number= this.company.jobSet.indexOf(job);
      if(index !== -1){
        this.company.jobSet.splice(index,1);
      }
      this.storageService.storeCompany(this.company);
    }),(error =>{
        console.log(error);
    }))
  }

  deActivateJob(job){
    if(job.active){
      job.active=false;

    }else{
      job.active=true;

    }
    let company : Company=new Company();
    company.id=this.company.id;
    job.company=company;
    this.jobService.updateJob(job).then((response =>{
      if(response.active){
        this.activeJobs++;
        this.toast.successToastr('Job activated!!!', 'Success!', {
          position: 'top-right'
        });
      }else{
        this.activeJobs--;
        this.toast.successToastr('Job deactivated!!!', 'Success!', {
          position: 'top-right'
        });
      }
      const  index: number= this.company.jobSet.indexOf(job);
      if(index !== -1){
        this.company.jobSet.splice(index,1);
        this.company.jobSet.push(response);
      }
      this.storageService.storeCompany(this.company);
    }),(error =>{
      console.log(error);
    }))
  }



}
