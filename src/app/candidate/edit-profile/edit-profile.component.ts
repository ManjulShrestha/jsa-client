import { Component, OnInit } from '@angular/core';
import { MetadataService } from '../../services/metadata.service';
import { Candidate } from '../../models/candidate/candidate';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropdownService } from '../../services/dropdown.service';
import { StorageService } from '../../common/storage/storage.service';
import { CandidateService } from '../../services/candidate.service';
import { validAnimations } from '../../common/animations/validanimations';
import { OnAuthorized } from '../../common/accessManagement/onAuthorize.model';
import { User } from '../../models/identity/user';
import { CandidateSocialInfo } from '../../models/candidate/candidateSocialInfo';
import { CandidateContactInfo } from '../../models/candidate/candidateContactInfo';
import { ConstantMetaData } from '../../constants/ConstantMetaData';
import { FileUploadService } from '../../services/file-upload.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import {timeout} from 'rxjs/operators';
import {timer} from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit, OnAuthorized {
  showLoader = null;
  user: User = new User();
  dropDownSettings = {};
  dropDownSettingsCategory = {};
  candidate: Candidate = new Candidate();
  educationLevelsList = [];
  experienceList = [];
  languagesList = [];
  ageList = [];
  jobTitleList = [];
  countryList = [];
  cityList = [];
  category = [];
  genderList = [];
  selectedExperienceRange: any = [];
  selectedAgeRange: any = [];
  selectedEducationType: any = [];
  selectedLanguage: any = [];
  selectedJobTitle: any = [];
  selectedCountry: any = [];
  selectedCity: any = [];
  selectedCategory: any = [];
  selectedGender: any = [];
  categorySet: any = [];


  candidateProfileForm: FormGroup;
  candidateSocialForm: FormGroup;
  candidateContactForm: FormGroup;

  uploadingFile: boolean = false;
  candidateProfilePic: any;
  isImageLoading: boolean = true;

  constructor(
    private metadataService: MetadataService,
    private commonService: DropdownService,
    private storageService: StorageService,
    private candidateService: CandidateService,
    private fileUploadService: FileUploadService,
    public toastr: ToastrManager,
  ) {
  }

  ngOnInit() {
    this.initializeForm();
    this.populateDropDowns();
    this.populateCandidate();
  }

  onAuthorized() {

  }

  populateCandidate() {
    this.candidate = this.storageService.getCandidate();
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
      if (this.candidate.gender != null) {
        this.selectedGender.push({
          id: this.candidate.gender.id,
          data: this.candidate.gender,
          itemName: this.candidate.gender.nameEnglish
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
          this.selectedCategory.push({ id: value.id, data: value, itemName: value.nameEnglish });
        });
      }
      if (this.candidate.picturePath != null) {
        this.getImageFromService(this.candidate.picturePath);
      }
    } else {
      this.candidate = new Candidate();
    }
  }

  populateDropDowns() {
    this.dropDownSettings = this.commonService.setDropDowns(this.dropDownSettings);
    this.dropDownSettingsCategory = this.commonService.setDropDownsCategory(this.dropDownSettingsCategory);
    this.experienceList = this.commonService.populateDropdown(this.metadataService.getExperienceRange(), this.experienceList);
    this.educationLevelsList = this.commonService.populateDropdown(this.metadataService.getEducationType(), this.educationLevelsList);
    this.languagesList = this.commonService.populateDropdown(this.metadataService.getLanguage(), this.languagesList);
    this.ageList = this.commonService.populateDropdown(this.metadataService.getAgeRange(), this.ageList);
    this.jobTitleList = this.commonService.populateDropdown(this.metadataService.getJobTitle(), this.jobTitleList);
    this.countryList = this.commonService.populateDropdown(this.metadataService.getCountry(), this.countryList);
    this.cityList = this.commonService.populateDropdown(this.metadataService.getCity(), this.cityList);
    this.category = this.commonService.populateDropdown(this.metadataService.getCategory(), this.category);
    this.genderList = this.commonService.populateDropdown(this.metadataService.getGender(), this.genderList);
  }

  initializeForm() {
    this.candidateProfileForm = new FormGroup({
      'candidateName': new FormControl(null, Validators.required),
      'jobTitle': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'minimumSalary': new FormControl(null, Validators.required),
      'experienceRange': new FormControl(null, Validators.required),
      'age': new FormControl(null, Validators.required),
      'currentSalaryMinimum': new FormControl(null, Validators.required),
      'currentSalaryMaximum': new FormControl(null, Validators.required),
      'expectedSalaryMinimum': new FormControl(null, Validators.required),
      'expectedSalaryMaximum': new FormControl(null, Validators.required),
      'educationLevel': new FormControl(null, Validators.required),
      'languages': new FormControl(null, Validators.required),
      'category': new FormControl(null, Validators.required),
      'gender': new FormControl(null, Validators.required),
    });
    this.candidateSocialForm = new FormGroup({
      'facebook': new FormControl(null, Validators.required),
      'twitter': new FormControl(null, Validators.required),
      'google': new FormControl(null, Validators.required),
      'linkedIn': new FormControl(null, Validators.required)
    });
    this.candidateContactForm = new FormGroup({
      'phoneNumber': new FormControl(null, Validators.required),
      'email': new FormControl(null, Validators.required),
      'website': new FormControl(null, Validators.required),
      'country': new FormControl(null, Validators.required),
      // 'city': new FormControl(null, Validators.required),
      'mapDetail': new FormControl(null, Validators.required),
      'latitude': new FormControl(null, Validators.required),
      'longitude': new FormControl(null, Validators.required),
    });
  }

  isFieldValid(field: string, form: FormGroup) {
    let result: boolean = !form.get(field).valid && form.get(field).touched;
    return result;
  }

  submit() {
    this.showLoader = true;
    this.candidate.user = this.storageService.getCurrentUser();
    if (!this.candidateSocialForm.valid || !this.candidateProfileForm.valid || !this.candidateContactForm.valid) {
      for (let key in this.candidateProfileForm.value) {
        this.candidateProfileForm.get(key).markAsTouched();
      }
      for (let key in this.candidateContactForm.value) {
        this.candidateContactForm.get(key).markAsTouched();
      }
      for (let key in this.candidateSocialForm.value) {
        this.candidateSocialForm.get(key).markAsTouched();
      }
      // event.resolve();
      this.showLoader=false;
      return;
    }
    if (this.selectedJobTitle.length > 0) {
      this.candidate.jobTitle = this.selectedJobTitle[0].data;
    }
    if (this.selectedExperienceRange.length > 0) {
      this.candidate.experienceRange = this.selectedExperienceRange[0].data;
    }
    if (this.selectedAgeRange.length > 0) {
      this.candidate.ageRange = this.selectedAgeRange[0].data;
    }
    if (this.selectedLanguage.length > 0) {
      this.candidate.language = this.selectedLanguage[0].data;
    }
    if (this.selectedEducationType.length > 0) {
      this.candidate.educationType = this.selectedEducationType[0].data;
    }
    if (this.selectedCountry.length > 0) {
      this.candidate.candidateContactInfo.country = this.selectedCountry[0].data;
    }
    if (this.selectedCity.length > 0) {
      this.candidate.candidateContactInfo.city = this.selectedCity[0].data;
    }
    if (this.selectedGender.length > 0) {
      this.candidate.gender = this.selectedGender[0].data;
    }
    if (this.selectedCategory.length > 0) {
      this.selectedCategory.map(
        (value) => {
          this.categorySet.push(value.data);
        }
      );
      this.candidate.categorySet = this.categorySet;
    }
    if (this.candidate.id != null) {
      this.candidateService.updateCandidate(this.candidate).then((response) => {
        console.log(response);
        let resume= this.candidate.candidateResume;
        this.candidate = response;
        this.candidate.candidateResume=resume;
        this.storageService.storeCandidate(this.candidate);
        this.showLoader = false;
        this.toastr.successToastr('Profile successfully updated!!!', 'Success!', {
          position: 'top-right'
        });
      }, (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log(error);
      });
    } else {
      this.candidateService.addCandidate(this.candidate).then((response) => {
        this.candidate = response;
        this.storageService.storeCandidate(this.candidate);
        this.showLoader = false;
        this.toastr.successToastr('Profile successfully updated!!!', 'Success!', {
          position: 'top-right'
        });
        window.location.reload();
      }, (error) => {
        this.showLoader = false;
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
      });
    }
  }

  onAddItem(event) {
    this.commonService.onAddItem(event, this.category, this.selectedCategory);
  }

  photoUpload(event) {

    let file = event.target.files[0];
    if (this.checkFileSize(file)) {
      this.uploadingFile = true;
      let formData = new FormData();
      formData.append("name", file);

      this.fileUploadService.uploadFile(file.name, formData).then(
        value => {
          this.candidate.picturePath = value.message;
          this.submit();
          this.getImageFromService(this.candidate.picturePath);
        }
      );
    } else {

    }
  }

  checkFileSize(document) {

    return document.size <= ConstantMetaData.MAX_FILE_SIZE;

  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    /* reader.addEventListener("load", () => {
       this.companyProfilePic = reader.result;
     }, false);*/

    if (image) {
      reader.readAsDataURL(image);
      reader.onload = (event) => { // called once readAsDataURL is completed
        console.log(event);
        this.candidateProfilePic = reader.result;
      }
    }
  }

  getImageFromService(filePath: String) {
    this.isImageLoading = true;
    this.fileUploadService.viewFile('thumb_' + filePath).then((response) => {
      this.createImageFromBlob(response);
      this.isImageLoading = false;
    }, (error) => {
      this.isImageLoading = false;
      console.log(error);
    });
  }

}
