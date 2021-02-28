import { Component, OnInit } from '@angular/core';
import { OnAuthorized } from '../../common/accessManagement/onAuthorize.model';
import { Candidate } from '../../models/candidate/candidate';
import { StorageService } from '../../common/storage/storage.service';
import { ResumeService } from '../../services/resume.service';
import { FileUploadService } from '../../services/file-upload.service';
import { CandidateService } from '../../services/candidate.service';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnAuthorized {

  candidate: Candidate;
  isImageLoading: boolean = true;
  appliedJobCount: number;
  followedCompanyCount: number;
  jobCount: number;

  constructor(private storageService: StorageService,
    private resumeService: ResumeService,
    private fileUploadService: FileUploadService,
    private candidateService: CandidateService,
    private jobService: JobService
  ) {
  }

  ngOnInit() {
    this.populateCandidate();
  }

  onAuthorized() {
  }

  populateCandidate() {
    this.candidate = this.storageService.getCandidate();
    if (this.candidate.candidateResume == null) {
      this.resumeService.getResumeByCandidateId(this.candidate.id).then((response => {
        this.candidate.candidateResume = response;
        this.storageService.storeCandidate(this.candidate);

      }), (error => {
        console.log('ERROR OCCURED', error);
      }));
    }
    if (this.candidate.id != null) {
      this.candidateService.getAppliedJobsCount(this.candidate.id).then((response => {
        this.appliedJobCount = response;
      }), (error => {

      }))
      this.candidateService.getFollowedCompanyCount(this.candidate.id).then((response => {
        this.followedCompanyCount = response;
      }), (error => {

      }))
    }
    this.jobService.getJobCount().then((response => {
      this.jobCount = response;
    }), (error => {

    }))
  }

  getFileFromService(filePath: String) {
    this.fileUploadService.viewFile(filePath).then((response) => {
      var file = new Blob([response], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }, (error) => {
      console.log(error);
    });
  }
}
