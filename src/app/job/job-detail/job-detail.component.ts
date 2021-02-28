import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {JobService} from '../../services/job.service';
import {Job} from '../../models/company/job';
import {Candidate} from '../../models/candidate/candidate';
import {StorageService} from '../../common/storage/storage.service';
import {ToastrManager} from 'ng6-toastr-notifications';
import {CompanyService} from '../../services/company.service';
import {FileUploadService} from '../../services/file-upload.service';
import {ConstantMetaData} from '../../constants/ConstantMetaData';
import {User} from '../../models/identity/user';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit {

  user: User;

  job: Job = new Job();
  jobLoaded:boolean=false;
  expired:boolean=false;
  remainingDate:number;
  isCompany:boolean=false;
  candidate:Candidate = new Candidate();
  jobApplied:String='Apply for job';
  showLoader:boolean=false;

  constructor(private route: ActivatedRoute,
              private jobService: JobService,
              private storageService: StorageService,
              private router: Router,
              private toast: ToastrManager,
              private companyService: CompanyService,
              private fileUploadService: FileUploadService,
              private toastr: ToastrManager) {
  }

  ngOnInit() {
    this.checkHeader();
  }

  checkHeader(){
    this.showLoader=true;
    this.route.params.subscribe(
      (params) => {
        // Defaults to 0 if no query param provided.
        let jobId= +params['id'] || 0;
        if(jobId != 0){
          this.jobService.getJobById(jobId).then((response =>{
            this.job=response;
            this.companyService.getCompanyByJob(jobId).then((response =>{
              this.job.company=response;
              this.jobLoaded=true;
              this.fetchCompanyPhoto();
              this.showLoader=false;
            }),(error =>{
              this.showLoader=false;
            }));
            this.remainingDate=Math.trunc((new Date(this.job.applicationDeadline).getTime()-new Date().getTime())/(1000*3600*24));
            if (this.remainingDate<1){
              this.expired=true;
            }
            this.populateCandidateCompany();
          }),(error =>{
            console.log(error);
          }));
        }
      }
    );
  }

  populateCandidateCompany(){
    this.user = this.storageService.getCurrentUser();
    this.candidate=this.storageService.getCandidate();
    let company=this.storageService.getCompany();
    if (this.candidate != null){
      this.viewJob();
    }
    if (company != null){
      this.isCompany=true;
    }

  }

  applyJob(jobId) {
    if (this.user && !this.candidate) {
      if (this.user.userType.id == ConstantMetaData.CANDIDATE) {
        this.toastr.infoToastr('Please create your profile first!!!', 'Info!!!', {position: 'top-right'});
        this.router.navigateByUrl('/candidate/edit-profile');
      }
    } else if (!this.candidate && !this.user) {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          'jobId': jobId
        }
      };
      this.toastr.infoToastr('Please login first!!!', 'Info!!!', {position: 'top-right'});
      this.router.navigate(['/login-register'], navigationExtras);
    }else {
      this.jobService.applyJob(this.job.id, this.candidate).then((response => {
        if (response) {
          this.jobApplied = "Applied";
          this.toast.successToastr("Job Applied","Success !",{
            position: 'top-right'});
        } else {
          this.jobApplied = "Already applied for this job before";
          this.toast.infoToastr("Already applied for this job before","Information!",{
            position: 'top-right'});
        }

      }), (error => {

      }));
    }
  }

  viewJob(){
    this.jobService.viewJob(this.job.id,this.candidate).then((response =>{

    }),(error =>{

    }));
  }

  fetchCompanyPhoto(){
    let fileUploadService= this.fileUploadService;

      this.job.company.isImageLoading = true;
      if (this.job.company.picturePath != null){
        fileUploadService.viewFile('thumb_'+this.job.company.picturePath).then((response) => {
          let reader = new FileReader();
          if (response) {
            reader.readAsDataURL(response);
            reader.onload = (event) => {
              this.job.company.companyProfilePic = reader.result;
            }
          }
          this.job.company.isImageLoading = false;
        }, (error) => {
          this.job.company.isImageLoading = true;
          console.log(error);
        });
      }


  }

}
