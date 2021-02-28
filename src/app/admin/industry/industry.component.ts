import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Industry} from '../../models/metadata/industry';
import {MetadataService} from '../../services/metadata.service';
import {ModalManager} from 'ngb-modal';
import {ToastrManager} from 'ng6-toastr-notifications';

@Component({
  selector: 'app-industry',
  templateUrl: './industry.component.html',
  styleUrls: ['./industry.component.css']
})
export class IndustryComponent implements OnInit {

  industryList = [];
  industryForm: FormGroup;
  industry: Industry;
  objectType: string;
  action: string;
  showLoader = false;
  showString: string;
  @ViewChild('industryModal') industryModal;
  private modalRef;

  constructor(
    private metadataService: MetadataService,
    public modalService: ModalManager,
    public toastr: ToastrManager,
  ) {
  }

  ngOnInit() {
    this.populateIndustry();
    this.initializeForm();
  }

  initializeForm() {
    this.industryForm = new FormGroup({
      'nameEnglish': new FormControl(null, Validators.required)
    });
  }

  populateIndustry() {
    this.metadataService.getIndustry().then(response => {
      this.industryList = response;
    }), (error => {
      console.log('error is', error);
    });
  }

  addIndustry(popupName) {
    this.openPopup(new Industry(), popupName, 'industry', 'add');
  }

  saveIndustry(actionType) {
    this.showLoader = true;
    if (actionType == 'delete') {
      this.showString = 'deleted';
      this.industry.deleted = true;
    } else {
      this.showString = 'updated';
    }
    if (this.industry.id != null) {
      this.metadataService.updateIndustry(this.industry).then((response) => {
        this.industry = response;
        this.closeModal();
        this.populateIndustry();
        this.showLoader = false;
        this.toastr.successToastr('Industry sucessfully ' + this.showString + '!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------1----', error);
      };
    } else {
      this.metadataService.addIndustry(this.industry).then((response) => {
        this.industry = response;
        this.closeModal();
        this.populateIndustry();
        this.showLoader = false;
        this.toastr.successToastr('Industry sucessfully added!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------2----', error);
      };
    }
  }

  openPopup(object, popupForm, objectType, action) {
    this.industry = object;
    this.objectType = 'industry';
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
    } else if (action == 'delete') {
      this.action = 'delete';
    }
  }
}
