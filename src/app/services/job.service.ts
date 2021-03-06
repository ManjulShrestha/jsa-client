import {EventEmitter, Injectable} from '@angular/core';
import {HttpService} from './http/http.service';
import {User} from '../models/identity/user';
import {Company} from '../models/company/company';
import {Job} from '../models/company/job';
import {Candidate} from '../models/candidate/candidate';

@Injectable()
export class JobService {



  constructor(private http: HttpService) {
  }

  addJob(job: Job) {
    return this.http.post('job', job);
  }

  updateJob(job: Job){
    return this.http.put('job', job);
  }

  getJobById(id){
    return this.http.get('job/'+id);
  }

  getActiveJobs(page:number, size:number){
    return this.http.get('job/pageable?page='+page+'&size='+size);
  }

  getJobCount(){
    return this.http.get('job/count');
  }

  getJobCountByCategory(categoryId){
    return this.http.get('job/count/'+categoryId);
  }

  applyJob(jobId:number, candidate:Candidate){
    return this.http.post('job/apply/'+jobId,candidate)
  }

  viewJob(jobId:number, candidate:Candidate) {
    return this.http.post('job/view/' + jobId, candidate)
  }

  getAppliedCandidate(companyId){
    return this.http.get('job/applied-candidates/'+companyId);
  }

  shortlist(jobCandidateApplication){
    return this.http.put('job/shortlist',jobCandidateApplication);
  }

  getJobByCategory(categoryIds: any) {
    return this.http.get('job/job-by-category?id=' + categoryIds);
  }
}
