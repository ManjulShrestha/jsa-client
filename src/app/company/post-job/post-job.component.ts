import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Job } from '../../models/company/job';
import { DropdownService } from '../../services/dropdown.service';
import { MetadataService } from '../../services/metadata.service';
import { StorageService } from '../../common/storage/storage.service';
import { Company } from '../../models/company/company';
import { JobService } from '../../services/job.service';
import { OnAuthorized } from '../../common/accessManagement/onAuthorize.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.css']
})
export class PostJobComponent implements OnInit, OnAuthorized {

  showLoader = null;

  dropDownSettingsSkill = {};
  dropdownSettings = {};
  jobForm: FormGroup;
  company: Company;
  job: Job = new Job();
  industry = [];
  category = [];
  country = [];
  city = [];
  jobTitle = [];
  jobType = [];
  salary = [];
  careerLevel = [];
  experience = [];
  gender = [];
  qualification = [];
  skill = [];
  skillSet: any = [];



  selectedIndustry: any = [];
  selectedJobTitle: any = [];
  selectedCategory: any = [];
  selectedCountry: any = [];
  selectedCity: any = [];
  selectedJobType: any = [];
  selectedSalary: any = [];
  selectedCareerLevel: any = [];
  selectedExperience: any = [];
  selectedGender: any = [];
  selectedQualification: any = [];
  selectedSkill: any = [];

  constructor(private storageService: StorageService,
    private commonService: DropdownService,
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute,
    public toastr: ToastrManager,
    private metadataService: MetadataService) { }

  ngOnInit() {

    this.setDropDowns();
    this.setDropDownsSkill();
    this.company = this.storageService.getCompany();
    this.checkHeader();
  }

  checkHeader() {
    this.route.params.subscribe(
      (params) => {
        // Defaults to 0 if no query param provided.
        let jobId = +params['id'] || 0;
        if (jobId != 0) {
          this.jobService.getJobById(jobId).then((response => {
            this.job = response;
            this.populateJob();
          }), (error => {
            console.log(error);
          }));
        }else{
          let jobSlots=this.company.latestPayment.noOfJobSlots;
          let posted=this.company.latestPayment.noOfJobPosted;
          if(posted<jobSlots || jobSlots <0){

          }else{
            this.toastr.infoToastr('Jobs Post limit Exceeded','Subscription Expired !!',{position : 'top-right'});
            this.router.navigateByUrl('/company/dashboard');
          }
        }

        this.initializeForm();
        this.populateDropDown();
      }
    );
  }

  populateDropDown() {
    this.industry = this.commonService.populateDropdown(this.metadataService.getIndustry(), this.industry);
    this.category = this.commonService.populateDropdown(this.metadataService.getCategory(), this.category);
    this.country = this.commonService.populateDropdown(this.metadataService.getCountry(), this.country);
    this.city = this.commonService.populateDropdown(this.metadataService.getCity(), this.city);
    this.jobTitle = this.commonService.populateDropdown(this.metadataService.getJobTitle(), this.jobTitle);
    this.jobType = this.commonService.populateDropdown(this.metadataService.getJobType(), this.jobType);
    this.salary = this.commonService.populateDropdown(this.metadataService.getOfferedSalaryRange(), this.salary);
    this.careerLevel = this.commonService.populateDropdown(this.metadataService.getCareerLevel(), this.careerLevel);
    this.experience = this.commonService.populateDropdown(this.metadataService.getExperienceRange(), this.experience);
    this.gender = this.commonService.populateDropdown(this.metadataService.getGender(), this.gender);
    this.qualification = this.commonService.populateDropdown(this.metadataService.getQualification(), this.qualification);
    this.skill = this.commonService.populateDropdown(this.metadataService.getSkill(), this.skill);
  }

  populateJob() {
    this.job.applicationDeadline = new Date(this.job.applicationDeadline);
    if (this.job.jobTitle != null) {
      this.selectedJobTitle.push({ id: this.job.jobTitle.id, data: this.job.jobTitle, itemName: this.job.jobTitle.nameEnglish })
    }
    if (this.job.jobType != null) {
      this.selectedJobType.push({ id: this.job.jobType.id, data: this.job.jobType, itemName: this.job.jobType.nameEnglish })
    }
    if (this.job.category != null) {
      this.selectedCategory.push({ id: this.job.category.id, data: this.job.category, itemName: this.job.category.nameEnglish })
    }
    if (this.job.offeredSalaryRange != null) {
      this.selectedSalary.push({ id: this.job.offeredSalaryRange.id, data: this.job.offeredSalaryRange, itemName: this.job.offeredSalaryRange.nameEnglish })
    }
    if (this.job.careerLevel != null) {
      this.selectedCareerLevel.push({ id: this.job.careerLevel.id, data: this.job.careerLevel, itemName: this.job.careerLevel.nameEnglish })
    }
    if (this.job.experienceRange != null) {
      this.selectedExperience.push({ id: this.job.experienceRange.id, data: this.job.experienceRange, itemName: this.job.experienceRange.nameEnglish })
    }
    if (this.job.gender != null) {
      this.selectedGender.push({ id: this.job.gender.id, data: this.job.gender, itemName: this.job.gender.nameEnglish })
    }
    if (this.job.industry != null) {
      this.selectedIndustry.push({ id: this.job.industry.id, data: this.job.industry, itemName: this.job.industry.nameEnglish })
    }
    if (this.job.qualification != null) {
      this.selectedQualification.push({ id: this.job.qualification.id, data: this.job.qualification, itemName: this.job.qualification.nameEnglish })
    }
    if (this.job.skillSet != null) {
      this.job.skillSet.map((value) => {
        this.selectedSkill.push({ id: value.id, data: value, itemName: value.nameEnglish })
      });
    }
    if (this.job.country != null) {
      this.selectedCountry.push({ id: this.job.country.id, data: this.job.country, itemName: this.job.country.nameEnglish })
    }
    if (this.job.city != null) {
      this.selectedCity.push({ id: this.job.city.id, data: this.job.city, itemName: this.job.city.nameEnglish })
    }
  }

  initializeForm() {
    this.jobForm = new FormGroup({
      'jobTitle': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'email': new FormControl(null, Validators.required),
      'industry': new FormControl(null, Validators.required),
      'category': new FormControl(null, Validators.required),
      'jobType': new FormControl(null, Validators.required),
      'salary': new FormControl(null, Validators.required),
      'careerLevel': new FormControl(null, Validators.required),
      'experience': new FormControl(null, Validators.required),
      'gender': new FormControl(null, Validators.required),
      'qualification': new FormControl(null, Validators.required),
      'deadline': new FormControl(null, Validators.required),
      'skills': new FormControl(null, Validators.required),
      'country': new FormControl(null, Validators.required),
      'city': new FormControl(null),
      'completeAddress': new FormControl(null, Validators.required),
      'mapDetail': new FormControl(null, Validators.required),
      'latitude': new FormControl(null, Validators.required),
      'longitude': new FormControl(null, Validators.required)
    });
  }

  submit(event) {
    this.showLoader = true;
    if (this.selectedJobTitle.length > 0) {
      this.job.jobTitle = this.selectedJobTitle[0].data;
    }
    if (this.selectedJobType.length > 0) {
      this.job.jobType = this.selectedJobType[0].data;
    }
    if (this.selectedCategory.length > 0) {
      this.job.category = this.selectedCategory[0].data;
    }
    if (this.selectedSalary.length > 0) {
      this.job.offeredSalaryRange = this.selectedSalary[0].data;
    }
    if (this.selectedCareerLevel.length > 0) {
      this.job.careerLevel = this.selectedCareerLevel[0].data;
    }
    if (this.selectedExperience.length > 0) {
      this.job.experienceRange = this.selectedExperience[0].data;
    }
    if (this.selectedGender.length > 0) {
      this.job.gender = this.selectedGender[0].data;
    }
    if (this.selectedIndustry.length > 0) {
      this.job.industry = this.selectedIndustry[0].data;
    }
    if (this.selectedQualification.length > 0) {
      this.job.qualification = this.selectedQualification[0].data;
    }

    if (this.selectedSkill.length > 0) {
      this.selectedSkill.map(
        (value) => {
          this.skillSet.push(value.data);
        }
      );
      this.job.skillSet = this.skillSet;
    }
    if (this.selectedCountry.length > 0) {
      this.job.country = this.selectedCountry[0].data;
    }
    if (this.selectedCity.length > 0) {
      this.job.city = this.selectedCity[0].data;
    }

    this.job.company = this.company;
    this.job.picturePath=this.company.picturePath;
    if (this.job.id != null) {
      this.jobService.updateJob(this.job).then((response) => {
        this.job = response;
        this.job.applicationDeadline = new Date(this.job.applicationDeadline);
        this.showLoader = false;
        let company=this.company;
        let jobNew=this.job;
        this.company.jobSet.forEach(function (job) {
          if(job.id == response.id){
            company.jobSet[company.jobSet.indexOf(job)]=jobNew;
            return;
          }
        });
        this.company=company;
        this.storageService.storeCompany(this.company);
        this.toastr.successToastr('Job sucessfully updated!!!', 'Success!', {
          position: 'bottom-right'
        });
        console.log('Stored');
        this.router.navigateByUrl('/company/list-job');
      }, (error) => {
        this.showLoader = false;
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log(error);
      });
    } else {
      this.jobService.addJob(this.job).then((response) => {
        this.job = response;
        this.job.applicationDeadline = new Date(this.job.applicationDeadline);
        this.showLoader = false;
        this.company.jobSet.push(this.job);
        this.storageService.storeCompany(this.company);
        this.toastr.successToastr('Job sucessfully added!!!', 'Success!', {
          position: 'bottom-right'
        });
        this.router.navigateByUrl('/company/list-job');
      }, (error) => {
        this.showLoader = false;
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log(error);
      });
    }
  }


  setDropDowns() {
    this.dropdownSettings = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: false,
      enableCheckAll: false,
      showCheckbox: true,
      searchPlaceholderText: 'Search',
    };
  }

  setDropDownsSkill() {
    this.dropDownSettingsSkill = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };
  }

  onAddItem(event) {
    this.commonService.onAddSkill(event, this.skill, this.selectedSkill);
  }

  onAuthorized() {
  }

}
