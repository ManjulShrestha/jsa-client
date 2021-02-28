import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MetadataService} from '../../services/metadata.service';
import {ToastrManager} from 'ng6-toastr-notifications';
import {JobTitle} from '../../models/metadata/jobTitle';
import {ModalManager} from 'ngb-modal';

@Component({
  selector: 'app-jobtitle',
  templateUrl: './jobtitle.component.html',
  styleUrls: ['./jobtitle.component.css']
})
export class JobtitleComponent implements OnInit {

  jobtitleList = [];
  jobtitleForm: FormGroup;
  jobtitle: JobTitle = new JobTitle();
  objectType: string;
  action: string;
  showLoader = false;
  showString: string;
  @ViewChild('jobModule') jobModule;
  private modalRef;

  constructor(
    private metadataService: MetadataService,
    public modalService: ModalManager,
    public toastr: ToastrManager,
  ) {
  }

  ngOnInit() {
    this.populatejobtitle();
    this.initializeForm();
  }

  initializeForm() {
    this.jobtitleForm = new FormGroup({
      'nameEnglish': new FormControl(null, Validators.required)
    });
  }

  populatejobtitle() {
    this.metadataService.getJobTitle().then(response => {
      this.jobtitleList = response;
      console.log(this.jobtitleList);
    }), (error => {
      console.log('error is', error);
    });
  }

  addjobtitle(popupName) {
    this.openPopup(new JobTitle(), popupName, 'jobtitle', 'add');
  }

  savejobtitle(actionType) {
    this.showLoader = true;
    if (actionType == 'delete') {
      this.showString = 'deleted';
      this.jobtitle.deleted = true;
    } else {
      this.showString = 'updated';
    }
    if (this.jobtitle.id != null) {
      this.metadataService.updateJobTitle(this.jobtitle).then((response) => {
        this.jobtitle = response;
        this.closeModal();
        this.populatejobtitle();
        this.showLoader = false;
        this.toastr.successToastr('JobTitle sucessfully ' + this.showString + '!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------1----', error);
      };
    } else {
      this.metadataService.addJobTitle(this.jobtitle).then((response) => {
        this.jobtitle = response;
        this.closeModal();
        this.populatejobtitle();
        this.showLoader = false;
        this.toastr.successToastr('JobTitle sucessfully added!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------2----', error);
      };
    }
  }

  openPopup(object, popupForm, objectType, action) {
    this.jobtitle = object;
    this.objectType = 'jobtitle';
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
