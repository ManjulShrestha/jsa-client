import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MetadataService} from '../../services/metadata.service';
import {Candidate} from '../../models/candidate/candidate';
import {DropdownService} from '../../services/dropdown.service';
import {StorageService} from '../../common/storage/storage.service';
import {OnAuthorized} from '../../common/accessManagement/onAuthorize.model';
import {User} from '../../models/identity/user';
import {CandidateSocialInfo} from '../../models/candidate/candidateSocialInfo';
import {CandidateContactInfo} from '../../models/candidate/candidateContactInfo';
import {CandidateService} from '../../services/candidate.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CandidateResume} from '../../models/candidate/candidate-resume';
import {CandidateEducation} from '../../models/candidate/candidate-education';
import {v4 as uuId} from 'uuid';
import {CandidateWorkExperience} from '../../models/candidate/candidate-work-experience';
import {CandidateAwards} from '../../models/candidate/candidate-awards';
import {CandidateProfessionalSkills} from '../../models/candidate/candidate-professional-skills';
import {ResumeService} from '../../services/resume.service';
import {CandidatePortFolio} from '../../models/candidate/candidate-port-folio';
import {ConstantMetaData} from '../../constants/ConstantMetaData';
import {FileUploadService} from '../../services/file-upload.service';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ModalManager} from 'ngb-modal';
import {Router} from '@angular/router';
import {City} from '../../models/metadata/city';
import {Country} from '../../models/metadata/country';

declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnAuthorized {

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
  selectedPortfolio: CandidatePortFolio;
  educationForm: FormGroup;
  workExperienceForm: FormGroup;
  candidateProfessionalSkillsForm: FormGroup;
  candidateAwardsForm: FormGroup;
  educationLevelsList = [];
  dropDownSettings = {};
  i: number;
  j: number;
  resume: CandidateResume = new CandidateResume();
  educationList = [];
  workExperienceList = [];
  awardsList = [];
  professionalSkillsList = [];
  showLoader = false;
  action: string = '';
  delete: boolean = false;
  objectType: string;
  uploadingFile: boolean = false;
  candidateProfilePic: any;
  candidateResumePdf: any;
  isImageLoading: boolean = true;
  showString: string;
  professionalSkill: CandidateProfessionalSkills = new CandidateProfessionalSkills();
  percentageRange: boolean = false;

  @ViewChild('educationModal') educationModal;
  @ViewChild('workExperienceModal') workExperienceModal;
  @ViewChild('portfolioModal') portfolioModal;
  @ViewChild('professionalSkillModal') professionalSkillModal;
  @ViewChild('awardModal') awardModal;
  @ViewChild('deleteModal') deleteModal;
  private modalRef;

  constructor(
    private metadataService: MetadataService,
    private commonService: DropdownService,
    private storageService: StorageService,
    private modalService: ModalManager,
    private candidateService: CandidateService,
    private resumeService: ResumeService,
    private fileUploadService: FileUploadService,
    public toastr: ToastrManager,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.populateCandidate();
    this.initializeForm();
    this.populateCanidateDetails();
    this.populateDropDowns();
  }

  onAuthorized() {

  }

  initializeForm() {
    this.educationForm = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'startDate': new FormControl(null, Validators.required),
      'endDate': new FormControl(null, Validators.required),
      'institute': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'educationType': new FormControl(null, Validators.required),
    });
    this.workExperienceForm = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'company': new FormControl(null, Validators.required),
      'startDate': new FormControl(null, Validators.required),
      'endDate': new FormControl(null, Validators.required),
      'present': new FormControl(null, Validators.required),
    });
    this.candidateProfessionalSkillsForm = new FormGroup({
      'skillHeading': new FormControl(null, Validators.required),
      'percentage': new FormControl([null, Validators.required, Validators.min(100)]),
    });
    this.candidateAwardsForm = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'startDate': new FormControl(null, Validators.required),
      'endDate': new FormControl(null, Validators.required),
    });
  }


  isFieldValid(field: string, form: FormGroup) {
    let result: boolean = !form.get(field).valid && form.get(field).touched;
    return result;
  }

  populateDropDowns() {
    this.dropDownSettings = this.commonService.setDropDowns(this.dropDownSettings);
    this.educationLevelsList = this.commonService.populateDropdown(this.metadataService.getEducationType(), this.educationLevelsList);
  }

  populateCanidateDetails() {
    this.candidate = this.storageService.getCandidate();
    if (this.candidate != null) {
      if (this.candidate.candidateResume != null) {
        if (this.candidate.candidateResume.candidateEducations != null && this.candidate.candidateResume.candidateEducations.length > 0) {
          this.educationList = this.candidate.candidateResume.candidateEducations;
          for (let edu in this.educationList) {           // edu ma education ko position aaucha like [0],[1]...
            this.generateEducationFormControls(this.educationList[edu].uuId);
          }
        } else {
          // this.addEducation();
        }
        if (this.candidate.candidateResume.candidateAwards != null && this.candidate.candidateResume.candidateAwards.length > 0) {
          this.awardsList = this.candidate.candidateResume.candidateAwards;
          for (let award in this.awardsList) {
            this.generateAwardsFormControls(this.awardsList[award].uuId);
          }
        } else {
          // this.addAwards();
        }
        if (this.candidate.candidateResume.candidateWorkExperiences) {
          this.workExperienceList = this.candidate.candidateResume.candidateWorkExperiences;
          for (let works in this.workExperienceList) {
            this.generateWorkExperienceFormControls(this.workExperienceList[works].uuId);
          }
        } else {
          // this.addWorkExperiences();
        }
        if (this.candidate.candidateResume.candidateProfessionalSkills != null && this.candidate.candidateResume.candidateProfessionalSkills.length > 0) {
          this.professionalSkillsList = this.candidate.candidateResume.candidateProfessionalSkills;
          for (let skill in this.professionalSkillsList) {
            this.generateProfessionalSkillsFormControls(this.professionalSkillsList[skill].uuId);
          }
        } else {
          // this.addProfessionalSkills();
        }
        this.parseDates();
      } else {
        this.candidate.candidateResume = new CandidateResume();
      }
    } else {
      this.candidate = new Candidate();
    }
  }

  deleteObject(objectToDelete) {
    if (objectToDelete == 'education') {
      this.saveEducation(this.selectedEducation, 'delete');
    } else if (objectToDelete == 'workExperience') {
      this.saveWorkExperience(this.selectedWorkExperience, 'delete');
    } else if (objectToDelete == 'award') {
      this.saveAwards(this.selectedAward, 'delete');
    } else if (objectToDelete == 'professionalSkill') {
      this.saveProfessionalSkills(this.selectedProfessionalSkill, 'delete');
    } else {
      this.closeModal();
    }
  }

  saveEducation(education: CandidateEducation, actionType) {
    this.showLoader = true;
    this.resume.id = this.candidate.candidateResume.id;
    education.candidateResume = this.resume;
    if (actionType == 'delete') {
      this.showString = 'deleted';
      education.deleted = true;
    } else {
      this.showString = 'updated';
    }
    if (education.id != null) {
      this.resumeService.updateCandidateEducation(education).then((response) => {
        let index = this.educationList.indexOf(education);
        response.startDate = new Date(response.startDate);
        response.endDate = new Date(response.endDate);
        this.educationList[index] = response;
        this.candidate.candidateResume.candidateEducations = this.educationList;
        this.storageService.storeCandidate(this.candidate);
        //this.reloadResume();
        this.closeModal();
        this.showLoader = false;
        console.log('Education updated');
        this.toastr.successToastr('Education sucessfully ' + this.showString + '!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------1----', error);
      };
    } else {
      this.resumeService.addCandidateEducation(education).then((response) => {
        response.startDate = new Date(response.startDate);
        response.endDate = new Date(response.endDate);
        this.educationList.push(response);
        this.candidate.candidateResume.candidateEducations = this.educationList;
        this.storageService.storeCandidate(this.candidate);
        //this.reloadResume();
        this.closeModal();
        this.showLoader = false;
        this.toastr.successToastr('Education sucessfully added!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------2----', error);
      };
    }
  }

  saveWorkExperience(workExperience: CandidateWorkExperience, actionType) {
    this.showLoader = true;
    this.resume.id = this.candidate.candidateResume.id;
    workExperience.candidateResume = this.resume;
    if (actionType == 'delete') {
      this.showString = 'deleted';
      workExperience.deleted = true;
    } else {
      this.showString = 'updated';
    }
    if (workExperience.id != null) {
      this.resumeService.updateCandidateWorkExperience(workExperience, this.resume.id).then((response) => {
        let index = this.workExperienceList.indexOf(workExperience);
        response.startDate = new Date(response.startDate);
        response.endDate = new Date(response.endDate);
        this.workExperienceList[index] = response;
        this.candidate.candidateResume.candidateWorkExperiences = this.workExperienceList;
        this.storageService.storeCandidate(this.candidate);
        //this.reloadResume();
        this.closeModal();
        this.showLoader = false;
        this.toastr.successToastr('Work Experience sucessfully ' + this.showString + '!!!', 'Success!', {
          position: 'top-right'
        });
        console.log('Work Experience updated');
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------1----', error);
      };
    } else {
      this.resumeService.addCandidateWorkExperience(workExperience, this.resume.id).then((response) => {
        response.startDate = new Date(response.startDate);
        response.endDate = new Date(response.endDate);
        this.workExperienceList.push(response);
        this.candidate.candidateResume.candidateWorkExperiences = this.workExperienceList;
        this.storageService.storeCandidate(this.candidate);
        this.closeModal();
        this.showLoader = false;
        console.log('Work Experience added-----');
        this.toastr.successToastr('Work Experience sucessfully added!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------2----', error);
      };
    }
  }

  saveAwards(award: CandidateAwards, actionType) {
    this.showLoader = true;
    this.resume.id = this.candidate.candidateResume.id;
    award.candidateResume = this.resume;
    if (actionType == 'delete') {
      award.deleted = true;
      this.showString = 'deleted';
    } else {
      this.showString = 'updated';
    }
    if (award.id != null) {
      this.resumeService.updateCandidateAwards(award).then((response) => {
        let index = this.awardsList.indexOf(award);
        response.startDate = new Date(response.startDate);
        response.endDate = new Date(response.endDate);
        this.awardsList[index] = response;
        this.candidate.candidateResume.candidateAwards = this.awardsList;
        this.storageService.storeCandidate(this.candidate);
        this.closeModal();
        this.showLoader = false;
        this.toastr.successToastr('Award sucessfully ' + this.showString + '!!!', 'Success!', {
          position: 'top-right'
        });
        console.log('Award updated');
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------1----', error);
      };
    } else {
      this.resumeService.addCandidateAwards(award).then((response) => {
        response.startDate = new Date(response.startDate);
        response.endDate = new Date(response.endDate);
        this.awardsList.push(response);
        this.candidate.candidateResume.candidateAwards = this.awardsList;
        this.storageService.storeCandidate(this.candidate);
        this.closeModal();
        this.showLoader = false;
        this.toastr.successToastr('Award sucessfully  added!!!', 'Success!', {
          position: 'top-right'
        });
        console.log('Award added----');
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------2----', error);
      };
    }
  }

  saveProfessionalSkills(candidateProfessionalSkills: CandidateProfessionalSkills, actionType) {
    this.showLoader = true;
    this.resume.id = this.candidate.candidateResume.id;
    candidateProfessionalSkills.candidateResume = this.resume;
    if (actionType == 'delete') {
      candidateProfessionalSkills.deleted = true;
      this.showString = 'deleted';
    } else {
      this.showString = 'updated';
    }
    if (candidateProfessionalSkills.percentage > 100) {
      let test = this.candidateProfessionalSkillsForm.get('percentage-' + this.selectedProfessionalSkill.uuId);
      test.setErrors({
        'min': true,
      });
      this.percentageRange = true;
      this.showLoader = false;
      return;
    }
    if (candidateProfessionalSkills.id != null) {
      this.resumeService.updateCandidateProfessionalSkills(candidateProfessionalSkills).then((response) => {
        let index = this.professionalSkillsList.indexOf(candidateProfessionalSkills);
        /* response.startDate=new Date(response.startDate);
         response.endDate=new Date(response.endDate);*/
        this.professionalSkillsList[index] = response;
        this.candidate.candidateResume.candidateProfessionalSkills = this.professionalSkillsList;
        this.storageService.storeCandidate(this.candidate);
        this.closeModal();
        this.showLoader = false;
        this.toastr.successToastr('Professional skill sucessfully ' + this.showString + '!!!', 'Success!', {
          position: 'top-right'
        });
        console.log('Professional skill updated');
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------1----', error);
      };
    } else {
      this.resumeService.addCandidateProfessionalSkills(candidateProfessionalSkills).then((response) => {
        this.professionalSkillsList.push(response);
        this.candidate.candidateResume.candidateProfessionalSkills = this.professionalSkillsList;
        this.storageService.storeCandidate(this.candidate);
        this.toastr.successToastr('Professional skill sucessfully added!!!', 'Success!', {
          position: 'top-right'
        });

        this.closeModal();
        this.showLoader = false;
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------2----', error);
      };
    }
  }

  reloadResume() {
    this.resumeService.getResumeById(this.candidate.candidateResume.id).then((response => {
      this.candidate.candidateResume = response;
      //this.parseDates();
      this.showLoader = false;
      this.storageService.storeCandidate(this.candidate);
    }), (error => {
      this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
      console.log('Error caught---', error);
    }));
  }

  getCandidateEducationById(id) {
    return this.candidate.candidateResume.candidateEducations.filter(x => x.id === id);
  }

  addEducation(content) {
    let candidateEducation = new CandidateEducation();
    candidateEducation.uuId = uuId();
    this.selectedEducationType = '';
    this.generateEducationFormControls(candidateEducation.uuId);
    this.openPopup(candidateEducation, content, 'education', 'add');
  }

  addWorkExperiences(workExperience) {
    let candidateWorkExperience = new CandidateWorkExperience();
    candidateWorkExperience.uuId = uuId();
    this.generateWorkExperienceFormControls(candidateWorkExperience.uuId);
    this.openPopup(candidateWorkExperience, workExperience, 'workExperience', 'add');
  }

  addAwards(award) {
    let candidateAwards = new CandidateAwards();
    candidateAwards.uuId = uuId();
    this.generateAwardsFormControls(candidateAwards.uuId);
    this.openPopup(candidateAwards, award, 'award', 'add');
  }

  addProfessionalSkills(professionalSkill) {
    let candidateProfessionalSkills = new CandidateProfessionalSkills();
    candidateProfessionalSkills.uuId = uuId();
    this.generateProfessionalSkillsFormControls(candidateProfessionalSkills.uuId);
    this.openPopup(candidateProfessionalSkills, professionalSkill, 'professionalSkill', 'add');
  }

  /*  addPortFolios(portfolio) {
      let candidatePortFolio = new CandidatePortFolio();
      candidatePortFolio.uuId = uuId();
      this.awardsList.push(candidatePortFolio);
      this.generateWorkExperienceFormControls(candidatePortFolio.uuId);
      this.openPopup(candidatePortFolio, portfolio, 'portFolio', 'add');
    }*/

  generateEducationFormControls(uuId) {
    this.educationForm.addControl('title-' + uuId, new FormControl(null, Validators.required));
    this.educationForm.addControl('startDate-' + uuId, new FormControl(null, Validators.required));
    this.educationForm.addControl('endDate-' + uuId, new FormControl(null, Validators.required));
    this.educationForm.addControl('institute-' + uuId, new FormControl(null, Validators.required));
    this.educationForm.addControl('description-' + uuId, new FormControl(null, Validators.required));
    this.educationForm.addControl('educationLevel-' + uuId, new FormControl(null, Validators.required));
  }

  generateWorkExperienceFormControls(uuId) {
    this.workExperienceForm.addControl('title-' + uuId, new FormControl(null, Validators.required));
    this.workExperienceForm.addControl('startDate-' + uuId, new FormControl(null, Validators.required));
    this.workExperienceForm.addControl('endDate-' + uuId, new FormControl(null, Validators.required));
    this.workExperienceForm.addControl('company-' + uuId, new FormControl(null, Validators.required));
    this.workExperienceForm.addControl('description-' + uuId, new FormControl(null, Validators.required));
    this.workExperienceForm.addControl('present-' + uuId, new FormControl(null, Validators.required));
  }

  generateAwardsFormControls(uuId) {
    this.candidateAwardsForm.addControl('title-' + uuId, new FormControl(null, Validators.required));
    this.candidateAwardsForm.addControl('startDate-' + uuId, new FormControl(null, Validators.required));
    this.candidateAwardsForm.addControl('endDate-' + uuId, new FormControl(null, Validators.required));
    this.candidateAwardsForm.addControl('description-' + uuId, new FormControl(null, Validators.required));
  }

  generateProfessionalSkillsFormControls(uuId) {
    this.candidateProfessionalSkillsForm.addControl('skillHeading-' + uuId, new FormControl(null, Validators.required));
    this.candidateProfessionalSkillsForm.addControl('percentage-' + uuId, new FormControl(null, Validators.required));
  }

  openPopup(object, popupForm, objectType, action) {
    this.setAllSelectedObjectNull();
    if (objectType == 'education') {
      this.selectedEducation = object;
      this.objectType = 'education';
      this.setAction(action);
    } else if (objectType == 'workExperience') {
      this.selectedWorkExperience = object;
      this.objectType = 'workExperience';
      this.setAction(action);
    } else if (objectType == 'award') {
      this.selectedAward = object;
      this.objectType = 'award';
      this.setAction(action);
    } else if (objectType == 'professionalSkill') {
      this.selectedProfessionalSkill = object;
      this.objectType = 'professionalSkill';
      this.setAction(action);
    } else if (objectType == 'portFolio') {
      this.selectedPortfolio = object;
      this.objectType = 'portFolio';
      this.setAction(action);
    }
    /*   this.candidate = this.storageService.getCandidate();
       /!* this.modalService.open(popupForm, {}).result.then((result) => {
          console.log('result is', result);
        }).catch((error) => {
          console.log(error);
        });*!/*/

    this.modalRef = this.modalService.open(popupForm, {
      size: 'md',
      modalClass: 'mymodal',
      hideCloseButton: true,
      centered: false,
      backdrop: true,
      animation: true,
      keyboard: false,
      closeOnOutsideClick: false,
      backdropClass: 'modal-backdrop'
    });
  }

  setAction(action) {
    if (action == 'add') {
      this.action = 'add';
    } else if (action == 'edit') {
      this.action = 'edit';
    } else if (action == 'delete') {
      this.action = 'delete';
    }
    return this.action;
  }

  populateCandidate() {
    this.candidate = this.storageService.getCandidate();
    if (this.candidate) {
      if (!this.candidate.candidateSocialInfo) {
        this.candidate.candidateSocialInfo = new CandidateSocialInfo();
      }
      if (!this.candidate.candidateContactInfo) {
        this.candidate.candidateContactInfo = new CandidateContactInfo();
        this.candidate.candidateContactInfo.country = new Country();
        this.candidate.candidateContactInfo.city = new City();
      } else {
        this.email = 'mailto:' + this.candidate.candidateContactInfo.email;
      }
      if (this.candidate.experienceRange) {
        this.selectedExperienceRange.push({
          id: this.candidate.experienceRange.id,
          data: this.candidate.experienceRange,
          itemName: this.candidate.experienceRange.nameEnglish
        });
      }
      if (this.candidate.ageRange) {
        this.selectedAgeRange.push({
          id: this.candidate.ageRange.id,
          data: this.candidate.ageRange,
          itemName: this.candidate.ageRange.nameEnglish
        });
      }
      if (this.candidate.educationType) {
        this.selectedEducationType.push({
          id: this.candidate.educationType.id,
          data: this.candidate.educationType,
          itemName: this.candidate.educationType.nameEnglish
        });
      }
      if (this.candidate.language) {
        this.selectedLanguage.push({
          id: this.candidate.language.id,
          data: this.candidate.language,
          itemName: this.candidate.language.nameEnglish
        });
      }
      if (this.candidate.jobTitle) {
        this.selectedJobTitle.push({
          id: this.candidate.jobTitle.id,
          data: this.candidate.jobTitle,
          itemName: this.candidate.jobTitle.nameEnglish
        });
      }
      if (this.candidate.candidateContactInfo.country) {
        this.selectedCountry.push({
          id: this.candidate.candidateContactInfo.country.id,
          data: this.candidate.candidateContactInfo.country,
          itemName: this.candidate.candidateContactInfo.country.nameEnglish
        });
      }
      if (this.candidate.candidateContactInfo.city) {
        this.selectedCity.push({
          id: this.candidate.candidateContactInfo.city.id,
          data: this.candidate.candidateContactInfo.city,
          itemName: this.candidate.candidateContactInfo.city.nameEnglish
        });
      }
      if (this.candidate.categorySet) {
        this.candidate.categorySet.map((value) => {
          this.selectedCategory.push({id: value.id, data: value, itemName: value.nameEnglish});
        });
      }
    } else {
      this.candidate = new Candidate();
    }
    if (this.candidate.picturePath) {
      this.getImageFromService(this.candidate.picturePath, 'image');
    }
  }

  fileUpload(event) {
    this.showLoader = true;
    let file = event.target.files[0];
    if (this.checkFileSize(file)) {
      this.uploadingFile = true;
      let formData = new FormData();
      formData.append('name', file);

      this.fileUploadService.uploadFile(file.name, formData).then(
        value => {
          this.candidate = this.storageService.getCandidate();
          this.candidate.candidateResume.pdfPath = value.message;
          this.resumeService.updateCandidateResume(this.candidate.candidateResume, this.candidate.id).then(response => {
            this.candidate.candidateResume = response;
            this.storageService.storeCandidate(this.candidate);
            this.toastr.successToastr('Resume successfully uploaded !!!', 'Success!', {
              position: 'top-right'
            });
            this.showLoader = false;
          }), (error) => {
            this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
          };
          this.getImageFromService(this.candidate.candidateResume.pdfPath, 'pdf');
        }
      );
    } else {

    }
  }

  checkFileSize(document) {
    return document.size <= ConstantMetaData.MAX_FILE_SIZE;
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

  closeModal() {
    this.modalService.close(this.modalRef);
    this.setAllSelectedObjectNull();
    //or this.modalRef.close();
    console.log('closed');
  }

  setAllSelectedObjectNull() {
    this.selectedEducation = null;
    this.selectedWorkExperience = null;
    this.selectedAward = null;
    this.selectedPortfolio = null;
    this.selectedProfessionalSkill = null;
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
