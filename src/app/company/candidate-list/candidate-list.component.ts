import {Component, OnInit} from '@angular/core';
import {Company} from '../../models/company/company';
import {StorageService} from '../../common/storage/storage.service';
import {Candidate} from '../../models/candidate/candidate';
import {CandidateService} from '../../services/candidate.service';
import {CandidateResume} from '../../models/candidate/candidate-resume';
import {FileUploadService} from '../../services/file-upload.service';

declare var $: any;

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})
export class CandidateListComponent implements OnInit {

  company: Company = new Company();
  showLoader = false;
  candidateList: Candidate[] = [];
  totalCandidate: number;
  size = 5;
  page = 1;
  candidateResume: CandidateResume;
  isImageLoading: boolean = true;
  candidateProfilePic: any;
  candidateResumePdf: any;


  constructor(private storageService: StorageService,
              private candidateService: CandidateService,
              private fileUploadService: FileUploadService
  ) {
  }

  ngOnInit() {
    this.populateCandidateList();
    this.getTotalCandidate();
    this.populateCompanyDetails();
  }

  populateCompanyDetails() {
    this.company = this.storageService.getCompany();
  }


  populateCandidateList() {
    this.showLoader = true;
    this.candidateService.getCandidateList(this.page++, this.size).then(
      (response) => {
        if (this.candidateList.length == 0) {
          this.candidateList = response;

          this.fetchCompanyPhotos(this.candidateList);
        } else {
          this.fetchCompanyPhotos(response);
          this.candidateList = this.candidateList.concat(response);
        }
        let company=this.company;
        this.candidateList.forEach(function (candidate) {
          if(company.candidateFollowSetId.includes(candidate.id)){
            candidate.following=true;
          }
        });
        this.candidateList.sort(function (a,b) {
          return (a.following === b.following)? 0 : a.following? -1 : 1;
        });
        this.showLoader = false;
      }, (error) => {
        console.log(error);
      });
  }

  getTotalCandidate() {
    this.candidateService.getCandidatesCount().then(
      (response => {
        this.totalCandidate = response;
      }), (error => {
        console.log(error);
      })
    );
  }

  fetchCompanyPhotos(candidate: Candidate[]){
    let fileUploadService= this.fileUploadService;
    candidate.forEach(function (candidate) {
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
    })
  }
}
