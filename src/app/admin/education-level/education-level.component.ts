import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MetadataService} from '../../services/metadata.service';
import {ToastrManager} from 'ng6-toastr-notifications';
import {EducationType} from '../../models/metadata/educationType';
import {ModalManager} from 'ngb-modal';

@Component({
  selector: 'app-education-level',
  templateUrl: './education-level.component.html',
  styleUrls: ['./education-level.component.css']
})
export class EducationLevelComponent implements OnInit {

  educationLevelList = [];
  educationLevelForm: FormGroup;
  educationLevel: EducationType = new EducationType();
  objectType: string;
  action: string;
  showLoader = false;
  showString: string;
  @ViewChild('educationLevelModal') educationLevelModal;
  private modalRef;

  constructor(
    private metadataService: MetadataService,
    public modalService: ModalManager,
    public toastr: ToastrManager,
  ) {
  }

  ngOnInit() {
    this.populateeducationLevel();
    this.initializeForm();
  }

  initializeForm() {
    this.educationLevelForm = new FormGroup({
      'nameEnglish': new FormControl(null, Validators.required)
    });
  }

  populateeducationLevel() {
    this.metadataService.getEducationType().then(response => {
      this.educationLevelList = response;
      console.log(this.educationLevelList);
    }), (error => {
      console.log('error is', error);
    });
  }

  addEducationLevel(popupName) {
    this.openPopup(new EducationType(), popupName, 'educationLevel', 'add');
  }

  saveEducationLevel(actionType) {
    this.showLoader = true;
    if (actionType == 'delete') {
      this.showString = 'deleted';
      this.educationLevel.deleted = true;
    } else {
      this.showString = 'updated';
    }
    if (this.educationLevel.id != null) {
      this.metadataService.updateEducationType(this.educationLevel).then((response) => {
        this.educationLevel = response;
        this.closeModal();
        this.populateeducationLevel();
        this.showLoader = false;
        this.toastr.successToastr('Education level/type sucessfully ' + this.showString + '!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------1----', error);
      };
    } else {
      this.metadataService.addEducationType(this.educationLevel).then((response) => {
        this.educationLevel = response;
        this.closeModal();
        this.populateeducationLevel();
        this.showLoader = false;
        this.toastr.successToastr('Education level/type sucessfully added!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------2----', error);
      };
    }
  }

  openPopup(object, popupForm, objectType, action) {
    this.educationLevel = object;
    this.objectType = 'educationLevel';
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
