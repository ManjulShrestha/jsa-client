import {Candidate} from '../candidate/candidate';
import {Job} from './job';

export class JobCandidateApplication  {
  jobId:number;
  candidateId:number;
  shortlisted:boolean;
  candidate:Candidate;
  job:Job;

}

