import {Component, OnInit} from '@angular/core';
import {User} from '../../models/identity/user';
import {Candidate} from '../../models/candidate/candidate';
import {CandidateEducation} from '../../models/candidate/candidate-education';
import {CandidateWorkExperience} from '../../models/candidate/candidate-work-experience';
import {CandidateAwards} from '../../models/candidate/candidate-awards';
import {CandidateProfessionalSkills} from '../../models/candidate/candidate-professional-skills';
import {CandidatePortFolio} from '../../models/candidate/candidate-port-folio';
import {CandidateResume} from '../../models/candidate/candidate-resume';
import {MetadataService} from '../../services/metadata.service';
import {DropdownService} from '../../services/dropdown.service';
import {CandidateService} from '../../services/candidate.service';
import {ResumeService} from '../../services/resume.service';
import {FileUploadService} from '../../services/file-upload.service';
import {CandidateSocialInfo} from '../../models/candidate/candidateSocialInfo';
import {CandidateContactInfo} from '../../models/candidate/candidateContactInfo';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.css']
})
export class CandidateProfileComponent implements OnInit {

  user: User = new User();
  candidate: Candidate = new Candidate();
  category = [];
  selectedExperienceRange: any = [];
  selectedAgeRange: any = [];
  selectedEducationType: any = [];
  selectedLanguage: any = [];
  selectedJobTitle: any = [];
  selectedCountry: any = [];
  selectedCity: any = [];
  selectedCategory: any = [];
  categorySet: any = [];
  email: string;
  selectedEducation: CandidateEducation;
  selectedWorkExperience: CandidateWorkExperience;
  selectedAward: CandidateAwards;
  selectedProfessionalSkill: CandidateProfessionalSkills;
  educationLevelsList = [];
  dropDownSettings = {};
  i: number;
  j: number;
  resume: CandidateResume = new CandidateResume();
  educationList = [];
  workExperienceList = [];
  awardsList = [];
  professionalSkillsList = [];
  delete: boolean = false;
  objectType: string;
  candidateProfilePic: any;
  candidateResumePdf: any;
  isImageLoading: boolean = true;
  showString: string;
  candidateResume: CandidateResume;
  showLoader: boolean = false;

  constructor(
    private metadataService: MetadataService,
    private commonService: DropdownService,
    private candidateService: CandidateService,
    private resumeService: ResumeService,
    private fileUploadService: FileUploadService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.checkHeader();
  }

  onAuthorized() {

  }

  checkHeader() {
    this.showLoader=true;
    this.route.params.subscribe(
      (params) => {
        // Defaults to 0 if no query param provided.
        let candidateId = +params['id'] || 0;
        if (candidateId != 0) {
          this.candidateService.getCandidateById(candidateId).then((response => {
            this.candidate = response;
            console.log(this.candidate);
            this.populateCandidate();
            this.populateResume();
            this.populateCanidateDetails();
            this.populateDropDowns();
          }), (error => {
            console.log(error);
          }));
        }
      }
    );
  }

  populateDropDowns() {
    this.dropDownSettings = this.commonService.setDropDowns(this.dropDownSettings);
    this.educationLevelsList = this.commonService.populateDropdown(this.metadataService.getEducationType(), this.educationLevelsList);
  }

  populateResume() {
    this.resumeService.getResumeByCandidateId(this.candidate.id).then((response => {
      this.candidate.candidateResume = response;
      this.showLoader=false;
    }));
  }

  populateCanidateDetails() {
    if (this.candidate != null) {
      if (this.candidate.candidateResume != null) {
        if (this.candidate.candidateResume.candidateEducations != null && this.candidate.candidateResume.candidateEducations.length > 0) {
          this.educationList = this.candidate.candidateResume.candidateEducations;
        }
        if (this.candidate.candidateResume.candidateAwards != null && this.candidate.candidateResume.candidateAwards.length > 0) {
          this.awardsList = this.candidate.candidateResume.candidateAwards;
        }
        if (this.candidate.candidateResume.candidateWorkExperiences) {
          this.workExperienceList = this.candidate.candidateResume.candidateWorkExperiences;
        }
        if (this.candidate.candidateResume.candidateProfessionalSkills != null && this.candidate.candidateResume.candidateProfessionalSkills.length > 0) {
          this.professionalSkillsList = this.candidate.candidateResume.candidateProfessionalSkills;
        }
        this.parseDates();
      } else {
        this.candidate.candidateResume = new CandidateResume();
      }
    } else {
      this.candidate = new Candidate();
    }
  }

  populateCandidate() {
    this.email = 'mailto:' + this.candidate.candidateContactInfo.email;
    if (this.candidate != null) {
      if (this.candidate.candidateSocialInfo == null) {
        this.candidate.candidateSocialInfo = new CandidateSocialInfo();
      }
      if (this.candidate.candidateContactInfo == null) {
        this.candidate.candidateContactInfo = new CandidateContactInfo();
      }
      if (this.candidate.experienceRange != null) {
        this.selectedExperienceRange.push({
          id: this.candidate.experienceRange.id,
          data: this.candidate.experienceRange,
          itemName: this.candidate.experienceRange.nameEnglish
        });
      }
      if (this.candidate.ageRange != null) {
        this.selectedAgeRange.push({
          id: this.candidate.ageRange.id,
          data: this.candidate.ageRange,
          itemName: this.candidate.ageRange.nameEnglish
        });
      }
      if (this.candidate.educationType != null) {
        this.selectedEducationType.push({
          id: this.candidate.educationType.id,
          data: this.candidate.educationType,
          itemName: this.candidate.educationType.nameEnglish
        });
      }
      if (this.candidate.language != null) {
        this.selectedLanguage.push({
          id: this.candidate.language.id,
          data: this.candidate.language,
          itemName: this.candidate.language.nameEnglish
        });
      }
      if (this.candidate.jobTitle != null) {
        this.selectedJobTitle.push({
          id: this.candidate.jobTitle.id,
          data: this.candidate.jobTitle,
          itemName: this.candidate.jobTitle.nameEnglish
        });
      }
      if (this.candidate.candidateContactInfo.country != null) {
        this.selectedCountry.push({
          id: this.candidate.candidateContactInfo.country.id,
          data: this.candidate.candidateContactInfo.country,
          itemName: this.candidate.candidateContactInfo.country.nameEnglish
        });
      }
      if (this.candidate.candidateContactInfo.city != null) {
        this.selectedCity.push({
          id: this.candidate.candidateContactInfo.city.id,
          data: this.candidate.candidateContactInfo.city,
          itemName: this.candidate.candidateContactInfo.city.nameEnglish
        });
      }
      if (this.candidate.categorySet != null) {
        this.candidate.categorySet.map((value) => {
          this.selectedCategory.push({id: value.id, data: value, itemName: value.nameEnglish});
        });
      }
    } else {
      this.candidate = new Candidate();
    }
    if (this.candidate.picturePath != null) {
      this.getImageFromService(this.candidate.picturePath, 'image');
    }
  }

  createImageFromBlob(image: Blob, fileType: string) {
    let reader = new FileReader();
    if (image) {
      reader.readAsDataURL(image);
      reader.onload = (event) => { // called once readAsDataURL is completed
        console.log(event);
        if (fileType == 'image') {
          this.candidateProfilePic = reader.result;
        } else if (fileType == 'pdf') {
          this.candidateResumePdf = reader.result;
        }
      };
    }
  }

  getImageFromService(filePath: String, fileType: string) {
    this.isImageLoading = true;
    this.fileUploadService.viewFile(filePath).then((response) => {
      if (fileType == 'image') {
        this.createImageFromBlob(response, fileType);
      }
      this.isImageLoading = false;
    }, (error) => {
      this.isImageLoading = false;
      console.log(error);
    });
  }

  getPDFFromService(filePath: String) {
    this.fileUploadService.viewFile(filePath).then((response) => {
      var file = new Blob([response], {type: 'application/pdf'});
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }, (error) => {
      console.log(error);
    });
  }

  parseDates() {
    if (this.educationList != null && this.educationList.length > 0) {
      this.educationList.forEach(function (value) {
        value.startDate = new Date(value.startDate);
        value.endDate = new Date(value.endDate);
      });
    }
    if (this.awardsList != null && this.awardsList.length > 0) {
      this.awardsList.forEach(function (value) {
        value.startDate = new Date(value.startDate);
        value.endDate = new Date(value.endDate);
      });
    }
    if (this.workExperienceList != null && this.workExperienceList.length > 0) {
      this.workExperienceList.forEach(function (value) {
        value.startDate = new Date(value.startDate);
        value.endDate = new Date(value.endDate);
      });
    }
  }

  google() {
    if (this.candidate.candidateSocialInfo.google) {
      if (this.candidate.candidateSocialInfo.google.toString().split(':').includes('http' || 'https')) {
        window.open(this.candidate.candidateSocialInfo.google, '_blank');
      } else {
        let googlePath = this.candidate.candidateSocialInfo.google.toString();
        googlePath = 'http://' + this.candidate.candidateSocialInfo.google.toString();
        window.open(googlePath, '_blank');
      }
    }
  }

  twitter() {
    if (this.candidate.candidateSocialInfo.twitter) {
      if (this.candidate.candidateSocialInfo.twitter.toString().split(':').includes('http' || 'https')) {
        window.open(this.candidate.candidateSocialInfo.twitter, '_blank');
      } else {
        let twitterPath = this.candidate.candidateSocialInfo.twitter.toString();
        twitterPath = 'http://' + this.candidate.candidateSocialInfo.twitter.toString();
        window.open(twitterPath, '_blank');
      }
    }
  }

  facebook() {
    if (this.candidate.candidateSocialInfo.facebook) {
      if (this.candidate.candidateSocialInfo.facebook.toString().split(':').includes('http' || 'https')) {
        window.open(this.candidate.candidateSocialInfo.facebook, '_blank');
      } else {
        let facebookPath = this.candidate.candidateSocialInfo.facebook.toString();
        facebookPath = 'http://' + this.candidate.candidateSocialInfo.facebook.toString();
        window.open(facebookPath, '_blank');
      }
    }
  }
}
