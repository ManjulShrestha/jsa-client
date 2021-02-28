import {Component, OnInit} from '@angular/core';
import {OnAuthorized} from '../../common/accessManagement/onAuthorize.model';
import {StorageService} from '../../common/storage/storage.service';
import {Candidate} from '../../models/candidate/candidate';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CandidateService} from '../../services/candidate.service';
import {CandidateEducation} from '../../models/candidate/candidate-education';
import {CandidateResume} from '../../models/candidate/candidate-resume';
import {CandidateWorkExperience} from '../../models/candidate/candidate-work-experience';
import {CandidateAwards} from '../../models/candidate/candidate-awards';
import {CandidateProfessionalSkills} from '../../models/candidate/candidate-professional-skills';
import {v4 as uuId} from 'uuid';
import {DropdownService} from '../../services/dropdown.service';
import {MetadataService} from '../../services/metadata.service';

@Component({
  selector: 'app-add-resume',
  templateUrl: './add-resume.component.html',
  styleUrls: ['./add-resume.component.css']
})

export class AddResumeComponent implements OnInit, OnAuthorized {

  candidate: Candidate = new Candidate();
  educationForm: FormGroup;
  workExperienceForm: FormGroup;
  candidateProfessionalSkillsForm: FormGroup;
  candidateAwardsForm: FormGroup;
  educationLevelsList = [];
  dropDownSettings = {};
  count2 = 0;
  count3 = 0;

  educationList = [];
  workExperienceList = [];
  awardsList = [];
  professionalSkillsList = [];

  constructor(private storageService: StorageService,
              private candidateService: CandidateService,
              private commonService: DropdownService,
              private metadataService: MetadataService
  ) {
  }

  ngOnInit() {
    this.initializeForm();
    this.populateCanidateDetails();
    this.populateDropDowns();
  }

  onAuthorized() {

  }

  /*openFormModal(education, content) {
    this.candidate = this.storageService.getCandidate();
    // const modalRef = this.modalService.open(EducationComponent);
    const modalRef = this.modalService.open(content);
    modalRef.result.then((result) => {
      console.log('result is', result);
    }).catch((error) => {
      console.log(error);
    });
  }*/

  populateDropDowns() {
    this.dropDownSettings = this.commonService.setDropDowns(this.dropDownSettings);
    this.educationLevelsList = this.commonService.populateDropdown(this.metadataService.getEducationType(), this.educationLevelsList);
  }

  initializeForm() {
    this.educationForm = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'startDate': new FormControl(null, Validators.required),
      'endDate': new FormControl(null, Validators.required),
      'institute': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'educationLevel': new FormControl(null, Validators.required),
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
      'percentage': new FormControl(null, Validators.required),
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

  populateCanidateDetails() {
    this.candidate = this.storageService.getCandidate();
    console.log('candidate is', this.candidate);
    if (this.candidate != null) {
      if (this.candidate.candidateResume != null) {

        if (this.candidate.candidateResume.candidateEducations != null && this.candidate.candidateResume.candidateEducations.length > 0) {
          this.educationList = this.candidate.candidateResume.candidateEducations;
          for (let edu in this.educationList) {           // edu ma education ko position aaucha like [0],[1]...
            this.generateEducationFormControls(this.educationList[edu].uuId);
          }
          this.educationList.forEach(function (value) {
            value.startDate = new Date(value.startDate);
          });
        } else {
          this.addEducation();
        }
        if (this.candidate.candidateResume.candidateAwards != null && this.candidate.candidateResume.candidateAwards.length > 0) {
          this.awardsList = this.candidate.candidateResume.candidateAwards;
          for (let award in this.awardsList) {
            this.generateAwardsFormControls();
          }
        } else {
          this.addAwards();
        }
        if (this.candidate.candidateResume.candidateWorkExperiences.length > 0 && this.candidate.candidateResume.candidateWorkExperiences != null) {
          this.workExperienceList = this.candidate.candidateResume.candidateWorkExperiences;
          for (let works in this.workExperienceList) {
            this.generateWorkExperienceFormControls(this.workExperienceList[works].uuId);
          }
        } else {
          this.addWorkExperiences();
        }
        if (this.candidate.candidateResume.candidateProfessionalSkills != null && this.candidate.candidateResume.candidateProfessionalSkills.length > 0) {
          this.professionalSkillsList = this.candidate.candidateResume.candidateProfessionalSkills;
          for (let skill in this.professionalSkillsList) {
            this.generateProfessionalSkillsFormControls();
          }
        } else {
          this.addProfessionalSkills();
        }
        if (this.candidate.candidateResume.candidatePortFolios != null && this.candidate.candidateResume.candidatePortFolios.length > 0) {
          // TODO
        }

      } else {
        this.candidate.candidateResume = new CandidateResume();
      }
    } else {
      this.candidate = new Candidate();
    }
  }

  submit(event) {
    this.storageService.storeCandidate(this.candidate);
    if (this.workExperienceList) {
      this.candidate.candidateResume.candidateWorkExperiences = this.workExperienceList;
    }
    if (this.educationList) {
      this.candidate.candidateResume.candidateEducations = this.educationList;
    }
    if (this.awardsList) {
      this.candidate.candidateResume.candidateAwards = this.awardsList;
    }
    if (this.professionalSkillsList) {
      this.candidate.candidateResume.candidateProfessionalSkills = this.professionalSkillsList;
    }
    let user = this.storageService.getCurrentUser();
    this.candidate.user = user;
    if (this.candidate.id != null) {
      this.candidateService.updateCandidate(this.candidate).then((response) => {
        this.candidate = null;
        this.candidate = response;
        this.storageService.storeCandidate(response);
        console.log('candidate stored');
      }), (error) => {
        console.log('-------------ERROR-----------1----', error);
      };
    } else {
      this.candidateService.addCandidate(this.candidate).then((response) => {
        this.candidate = response;
        this.storageService.storeCandidate(this.candidate);
      }), (error) => {
        console.log('-------------ERROR-----------2----', error);
      };
    }
  }

  addEducation() {
    let candidateEducation = new CandidateEducation();
    candidateEducation.uuId = uuId();
    this.educationList.push(candidateEducation);
    this.generateEducationFormControls(candidateEducation.uuId);
  }

  addWorkExperiences() {
    let candidateWorkExperience = new CandidateWorkExperience();
    candidateWorkExperience.uuId = uuId();
    this.workExperienceList.push(candidateWorkExperience);
    this.generateWorkExperienceFormControls(candidateWorkExperience.uuId);
  }

  addAwards() {
    this.awardsList.push(new CandidateAwards());
    this.generateAwardsFormControls();
  }

  addProfessionalSkills() {
    this.professionalSkillsList.push(new CandidateProfessionalSkills());
    this.generateProfessionalSkillsFormControls();
  }

  removeEducation(educationFromInput) {
    for (let educationInList in this.educationList) {
      if (this.educationList[educationInList].id == educationFromInput.id) {
        this.educationList[educationInList].deleted = true;
        this.candidate.candidateResume.candidateEducations = this.educationList;
        this.candidateService.updateCandidate(this.candidate).then((response) => {
          this.candidate = response;
          this.storageService.storeCandidate(this.candidate);
          console.log('candidate stored');
        }), (error) => {
          console.log('-------------ERROR-----------1----', error);
        };
      }
    }
  }

  removeWorkExperience(workExpFromInput) {
    for (let workinList in this.workExperienceList) {
      if (this.workExperienceList[workinList].id == workExpFromInput.id) {
        this.workExperienceList[workinList].deleted = true;
        this.candidate.candidateResume.candidateWorkExperiences = this.workExperienceList;
        this.candidateService.updateCandidate(this.candidate).then((response) => {
          this.candidate = response;
          this.storageService.storeCandidate(this.candidate);
          console.log('candidate stored');
        }), (error) => {
          console.log('-------------ERROR-----------1----', error);
        };
      }
    }
  }

  removeAward(awardFromInput) {
    for (let award in this.awardsList) {
      if (this.awardsList[award].id == awardFromInput.id) {
        this.awardsList[award].deleted = true;
        this.candidate.candidateResume.candidateAwards = this.awardsList;
        this.candidateService.updateCandidate(this.candidate).then((response) => {
          this.candidate = response;
          this.storageService.storeCandidate(this.candidate);
          console.log('candidate stored');
        }), (error) => {
          console.log('-------------ERROR-----------1----', error);
        };
      }
    }
  }

  removeProfessionalSkills(skillFromInput) {
    for (let skill in this.professionalSkillsList) {
      if (this.professionalSkillsList[skill].id == skillFromInput.id) {
        this.professionalSkillsList[skill].deleted = true;
        this.candidate.candidateResume.candidateProfessionalSkills = this.professionalSkillsList;
        this.candidateService.updateCandidate(this.candidate).then((response) => {
          this.candidate = response;
          this.storageService.storeCandidate(this.candidate);
          console.log('candidate stored');
        }), (error) => {
          console.log('-------------ERROR-----------1----', error);
        };
      }
    }
  }

  generateEducationFormControls(uuId) {
    this.educationForm.addControl('title-' + uuId, new FormControl(null, Validators.required));
    this.educationForm.addControl('startDate-' + uuId, new FormControl(null, Validators.required));
    this.educationForm.addControl('endDate-' + uuId, new FormControl(null, Validators.required));
    this.educationForm.addControl('institute-' + uuId, new FormControl(null, Validators.required));
    this.educationForm.addControl('description-' + uuId, new FormControl(null, Validators.required));
    this.educationForm.addControl('educationLevel-' + uuId, new FormControl(null, Validators.required));
    // this.count++;
  }

  generateWorkExperienceFormControls(uuId) {
    this.workExperienceForm.addControl('title-' + uuId, new FormControl(null, Validators.required));
    this.workExperienceForm.addControl('startDate-' + uuId, new FormControl(null, Validators.required));
    this.workExperienceForm.addControl('endDate-' + uuId, new FormControl(null, Validators.required));
    this.workExperienceForm.addControl('company-' + uuId, new FormControl(null, Validators.required));
    this.workExperienceForm.addControl('description-' + uuId, new FormControl(null, Validators.required));
    this.workExperienceForm.addControl('present-' + uuId, new FormControl(null, Validators.required));
  }

  generateAwardsFormControls() {
    this.candidateAwardsForm.addControl('title-' + this.count2, new FormControl(null, Validators.required));
    this.candidateAwardsForm.addControl('startDate-' + this.count2, new FormControl(null, Validators.required));
    this.candidateAwardsForm.addControl('endDate-' + this.count2, new FormControl(null, Validators.required));
    this.candidateAwardsForm.addControl('description-' + this.count2, new FormControl(null, Validators.required));
    this.count2++;
  }

  generateProfessionalSkillsFormControls() {
    this.candidateProfessionalSkillsForm.addControl('skillHeading-' + this.count3, new FormControl(null, Validators.required));
    this.candidateProfessionalSkillsForm.addControl('percentage-' + this.count3, new FormControl(null, Validators.required));
    this.count3++;
  }
}
