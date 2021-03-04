import {Component, OnInit} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {StorageService} from '../common/storage/storage.service';
import {JobService} from '../services/job.service';
import {Job} from '../models/company/job';
import {Candidate} from '../models/candidate/candidate';
import {FileUploadService} from '../services/file-upload.service';
import {ToastrManager} from 'ng6-toastr-notifications';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {


  jobs: Job[] = [];

  constructor(private jobService: JobService,
              private storageService: StorageService,
              private router: Router,
              private fileUploadService: FileUploadService,
              private toastr: ToastrManager,
  ) {
  }

  ngOnInit() {
    this.populateJob();
  }

  populateJob() {
    this.jobService.getActiveJobs(0, 5).then(
      (response) => {
        console.log(response);
        this.jobs = response;
        this.fetchCompanyPhotos(this.jobs);
      }, (error) => {
        console.log(error);
      });
  }

  postJob() {
    if (this.storageService.getCompany() != null) {
      this.router.navigateByUrl('/company/post-job/0');
    } else {
      this.router.navigateByUrl('/login-register');
    }
  }

  viewJob() {
    // if (this.storageService.getCandidate() != null) {
      this.router.navigateByUrl('/job/list/0');
    // }
    // else {
    //   this.router.navigateByUrl('/login-register');
    // }
  }

  viewJobWithoutLogIn(jobId: number) {
    this.router.navigateByUrl('/job/view/' + jobId);
  }

  applyJob(jobId: number) {
    if (this.storageService.getCandidate() != null) {
      this.router.navigateByUrl('/job/view/' + jobId);
    } else {
      this.toastr.infoToastr('Please login first!!!', 'Info!!!!', {
        position: 'top-right'
      });
      let navigationExtras: NavigationExtras = {
        queryParams: {
          'jobId': jobId
        }
      };
      this.router.navigate(['/login-register'], navigationExtras);
    }
  }

  fetchCompanyPhotos(jobs: Job[]) {
    let fileUploadService = this.fileUploadService;
    jobs.forEach(function (jobs) {
      jobs.isImageLoading = true;
      if (jobs.picturePath) {
        fileUploadService.viewFile('thumb_' + jobs.picturePath).then((response) => {
          let reader = new FileReader();
          if (response) {
            reader.readAsDataURL(response);
            reader.onload = (event) => {
              console.log(event);
              jobs.companyProfilePic = reader.result;
            };
          }
          jobs.isImageLoading = false;
        }, (error) => {
          jobs.company.isImageLoading = true;
          console.log(error);
        });
      }
    });
  }
}
