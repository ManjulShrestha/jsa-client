import { Component, OnInit } from '@angular/core';
import {JobService} from '../../services/job.service';
import {Company} from '../../models/company/company';
import {StorageService} from '../../common/storage/storage.service';
import {JobCandidateApplication} from '../../models/company/jobCandidateApplication';
import {ToastrManager} from 'ng6-toastr-notifications';
import {FileUploadService} from '../../services/file-upload.service';
import {Candidate} from '../../models/candidate/candidate';

@Component({
  selector: 'app-applied-candidate',
  templateUrl: './applied-candidate.component.html',
  styleUrls: ['./applied-candidate.component.css']
})
export class AppliedCandidateComponent implements OnInit {

  company: Company;
  jobCandidateApplication:JobCandidateApplication[];
  selectedjobCandidateApplication: JobCandidateApplication[]=[];
  showLoader:boolean = false;

  constructor(private jobService:JobService,
              private storageService:StorageService,
              private fileUploadService:FileUploadService,
              private toast:ToastrManager) { }



  ngOnInit() {
    this.showLoader=true;
    this.company=this.storageService.getCompany();
    this.company.jobSet.sort(function (a,b) {
      return (a.applied-b.applied) ?1 :-1;
    })
    this.popuateAppliedCandidates();
  }

  popuateAppliedCandidates(){
    this.jobService.getAppliedCandidate(this.company.id).then((response =>{
      this.jobCandidateApplication=response;
      this.jobCandidateApplication.forEach((item,index) =>{
        this.fetchCandidatePhotos(item.candidate);
      })
      this.selectJob(this.company.jobSet[0]);
      this.showLoader=false;
    }),(error=>{

    }))
  }

  selectJob(job){
    let selectedjobCandidateApplication:JobCandidateApplication[]=[];
    this.jobCandidateApplication.forEach(function (applications) {
      if(job.id==applications.jobId){
        selectedjobCandidateApplication.push(applications);
      }
    });
    this.selectedjobCandidateApplication=selectedjobCandidateApplication;

  }

  shortList(application,shortlist){
    application.shortlisted=shortlist;
    this.jobService.shortlist(application).then((response =>{
      application=response;
      if(application.shortlisted){
        this.toast.successToastr('Candidate Shortlisted!!!', 'Success!', {
          position: 'top-right'
        });
      }else{
        this.toast.successToastr('Candidate Removed From Shortlist!!!', 'Success!', {
          position: 'top-right'
        });
      }

    }),(error =>{

    }));
  }

  fetchCandidatePhotos(candidate: Candidate){
    let fileUploadService= this.fileUploadService;
      candidate.isImageLoading = true;
      if (candidate.picturePath != null){
        fileUploadService.viewFile('thumb_'+candidate.picturePath).then((response) => {
          let reader = new FileReader();
          if (response) {
            reader.readAsDataURL(response);
            reader.onload = (event) => {
              console.log(event);
              candidate.companyProfilePic = reader.result;
            }
          }
          candidate.isImageLoading = false;
        }, (error) => {
          candidate.isImageLoading = true;
          console.log(error);
        });
      }
  }
}
