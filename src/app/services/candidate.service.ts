import {Injectable} from '@angular/core';
import {User} from '../models/identity/user';
import {HttpService} from './http/http.service';
import {Candidate} from '../models/candidate/candidate';
import {Job} from '../models/company/job';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  user: User;

  constructor(private http: HttpService) {
  }

  addCandidate(candidate: Candidate) {
    return this.http.post('candidate/', candidate);
  }

  updateCandidate(candidate: Candidate) {
    return this.http.put('candidate/', candidate);
  }

  getCandidateByUser(userId: number) {
    return this.http.get('candidate/user-id/' + userId);
  }

  getCandidateList(page: number, size: number) {
    return this.http.get('candidate/?page=' + page + '&size=' + size);
  }

  getCandidatesCount() {
    return this.http.get('candidate/count');
  }

  getAppliedJobs(candidateId: number) {
    return this.http.get('candidate/applied-job/' + candidateId);
  }

  getAppliedJobsCount(candidateId: number) {
    return this.http.get('candidate/applied-job-count/' + candidateId);
  }

  getFollowedCompany(candidateId: number) {
    return this.http.get('candidate/followed-company/' + candidateId);
  }

  getFollowedCompanyCount(candidateId: number) {
    return this.http.get('candidate/followed-company-count/' + candidateId);
  }

  favouriteJob(canidateId: number, job: Job) {
    return this.http.post('candidate/favourite/' + canidateId, job);
  }

  unfavouriteJob(canidateId: number, job: Job) {
    return this.http.post('candidate/unfavourite/' + canidateId, job);
  }

  getCandidateById(candidateId) {
    return this.http.get('candidate/' + candidateId);
  }
}
