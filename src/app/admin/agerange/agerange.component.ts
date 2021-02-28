import {Component, OnInit, ViewChild} from '@angular/core';
import {MetadataService} from '../../services/metadata.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AgeRange} from '../../models/metadata/ageRange';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ModalManager} from 'ngb-modal';

@Component({
  selector: 'app-agerange',
  templateUrl: './agerange.component.html',
  styleUrls: ['./agerange.component.css']
})
export class AgerangeComponent implements OnInit {

  agerangeList = [];
  agerangeForm: FormGroup;
  agerange: AgeRange;
  objectType: string;
  action: string;
  showLoader = false;
  showString: string;
  @ViewChild('ageRangeModal') ageRangeModal;
  private modalRef;


  constructor(
    private metadataService: MetadataService,
    public modalService: ModalManager,
    public toastr: ToastrManager,
  ) {
  }

  ngOnInit() {
    this.populateAgeRange();
    this.initializeForm();
  }

  initializeForm() {
    this.agerangeForm = new FormGroup({
      'nameEnglish': new FormControl(null, Validators.required)
    });
  }

  populateAgeRange() {
    this.metadataService.getAgeRange().then(response => {
      this.agerangeList = response;
    }), (error => {
      console.log('error is', error);
    });
  }

  addAgeRange(popupName) {
    this.openPopup(new AgeRange(), popupName, 'agerange', 'add');
  }

  saveAgeRange(actionType) {
    this.showLoader = true;
    if (actionType == 'delete') {
      this.showString = 'deleted';
      this.agerange.deleted = true;
    } else {
      this.showString = 'updated';
    }
    if (this.agerange.id != null) {
      this.metadataService.updateAgeRange(this.agerange).then((response) => {
        this.agerange = response;
        this.closeModal();
        this.populateAgeRange();
        this.showLoader = false;
        this.toastr.successToastr('Age range sucessfully ' + this.showString + '!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------1----', error);
      };
    } else {
      this.metadataService.addAgeRange(this.agerange).then((response) => {
        this.agerange = response;
        this.closeModal();
        this.populateAgeRange();
        this.showLoader = false;
        this.toastr.successToastr('Age Range sucessfully added!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------2----', error);
      };
    }
  }

  openPopup(object, popupForm, objectType, action) {
    this.agerange = object;
    this.objectType = 'agerange';
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

  setAction(action) {
    if (action == 'add') {
      this.action = 'add';
    } else if (action == 'edit') {
      this.action = 'edit';
    }
  }

  closeModal() {
    this.modalService.close(this.modalRef);
  }
}
