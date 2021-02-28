import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MetadataService} from '../../services/metadata.service';
import {ModalManager} from 'ngb-modal';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ExperienceRange} from '../../models/metadata/experienceRange';

@Component({
  selector: 'app-experience-range',
  templateUrl: './experience-range.component.html',
  styleUrls: ['./experience-range.component.css']
})
export class ExperienceRangeComponent implements OnInit {

  experienceList = [];
  experienceForm: FormGroup;
  experience: ExperienceRange;
  objectType: string;
  action: string;
  showLoader = false;
  showString: string;
  @ViewChild('experienceModal') experienceModal;
  private modalRef;

  constructor(
    private metadataService: MetadataService,
    public modalService: ModalManager,
    public toastr: ToastrManager,
  ) {
  }

  ngOnInit() {
    this.populateExperience();
    this.initializeForm();
  }

  initializeForm() {
    this.experienceForm = new FormGroup({
      'nameEnglish': new FormControl(null, Validators.required)
    });
  }

  populateExperience() {
    this.metadataService.getExperienceRange().then(response => {
      this.experienceList = response;
    }), (error => {
      console.log('error is', error);
    });
  }

  addExperience(popupName) {
    this.openPopup(new ExperienceRange(), popupName, 'experience', 'add');
  }

  saveExperience(actionType) {
    this.showLoader = true;
    if (actionType == 'delete') {
      this.showString = 'deleted';
      this.experience.deleted = true;
    } else {
      this.showString = 'updated';
    }
    if (this.experience.id != null) {
      this.metadataService.updateExperienceRange(this.experience).then((response) => {
        this.experience = response;
        this.closeModal();
        this.populateExperience();
        this.showLoader = false;
        this.toastr.successToastr('Experience Range sucessfully ' + this.showString + '!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------1----', error);
      };
    } else {
      this.metadataService.addExperienceRange(this.experience).then((response) => {
        this.experience = response;
        this.closeModal();
        this.populateExperience();
        this.showLoader = false;
        this.toastr.successToastr('Experience Range sucessfully added!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------2----', error);
      };
    }
  }

  openPopup(object, popupForm, objectType, action) {
    this.experience = object;
    this.objectType = 'experience';
    this.setAction(action);
    this.modalRef = this.modalService.open(popupForm, {
      size: 'md',
      modalClass: 'mymodal',
      hideCloseButton: false,
      centered: false,
      backdrop: true,
      animation: true,
      keyboard: false,
      closeOnOutsideClick: false,
      backdropClass: 'modal-backdrop'
    });
  }

  closeModal() {
    this.modalService.close(this.modalRef);
  }

  setAction(action) {
    if (action == 'add') {
      this.action = 'add';
    } else if (action == 'edit') {
      this.action = 'edit';
    }
  }


}
