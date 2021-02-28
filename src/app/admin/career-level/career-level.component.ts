import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MetadataService} from '../../services/metadata.service';
import {ToastrManager} from 'ng6-toastr-notifications';
import {CareerLevel} from '../../models/metadata/careerLevel';
import {ModalManager} from 'ngb-modal';

@Component({
  selector: 'app-career-level',
  templateUrl: './career-level.component.html',
  styleUrls: ['./career-level.component.css']
})
export class CareerLevelComponent implements OnInit {

  careerLevelList = [];
  careerLevelForm: FormGroup;
  careerLevel: CareerLevel;
  objectType: string;
  action: string;
  showLoader = false;
  showString: string;
  @ViewChild('careerLevelModal') careerLevelModal;
  private modalRef;

  constructor(
    private metadataService: MetadataService,
    public modalService: ModalManager,
    public toastr: ToastrManager,
  ) {
  }

  ngOnInit() {
    this.populateCareerLevel();
    this.initializeForm();
  }

  initializeForm() {
    this.careerLevelForm = new FormGroup({
      'nameEnglish': new FormControl(null, Validators.required)
    });
  }

  populateCareerLevel() {
    this.metadataService.getCareerLevel().then(response => {
      this.careerLevelList = response;
    }), (error => {
      console.log('error is', error);
    });
  }

  addCareerLevel(popupName) {
    this.openPopup(new CareerLevel(), popupName, 'careerLevel', 'add');
  }

  saveAgeRange(actionType) {
    this.showLoader = true;
    if (actionType == 'delete') {
      this.showString = 'deleted';
      this.careerLevel.deleted = true;
    } else {
      this.showString = 'updated';
    }
    if (this.careerLevel.id != null) {
      this.metadataService.updateCareerLevel(this.careerLevel).then((response) => {
        this.careerLevel = response;
        this.closeModal();
        this.populateCareerLevel();
        this.showLoader = false;
        this.toastr.successToastr('Career Level sucessfully ' + this.showString + '!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------1----', error);
      };
    } else {
      this.metadataService.addCareerLevel(this.careerLevel).then((response) => {
        this.careerLevel = response;
        this.closeModal();
        this.populateCareerLevel();
        this.showLoader = false;
        this.toastr.successToastr('Career Level sucessfully added!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------2----', error);
      };
    }
  }

  openPopup(object, popupForm, objectType, action) {
    this.careerLevel = object;
    this.objectType = 'careerLevel';
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
