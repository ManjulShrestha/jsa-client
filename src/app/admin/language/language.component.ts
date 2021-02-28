import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MetadataService} from '../../services/metadata.service';
import {ToastrManager} from 'ng6-toastr-notifications';
import {Language} from '../../models/metadata/language';
import {ModalManager} from 'ngb-modal';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit {

  languageList = [];
  languageForm: FormGroup;
  language: Language;
  objectType: string;
  action: string;
  showLoader = false;
  showString: string;
  @ViewChild('languageModal') languageModal;
  private modalRef;

  constructor(
    private metadataService: MetadataService,
    public modalService: ModalManager,
    public toastr: ToastrManager,
  ) {
  }

  ngOnInit() {
    this.populateLanguage();
    this.initializeForm();
  }

  initializeForm() {
    this.languageForm = new FormGroup({
      'nameEnglish': new FormControl(null, Validators.required)
    });
  }

  populateLanguage() {
    this.metadataService.getLanguage().then(response => {
      this.languageList = response;
    }), (error => {
      console.log('error is', error);
    });
  }

  addLanguage(popupName) {
    this.openPopup(new Language(), popupName, 'language', 'add');
  }

  saveLanguage(actionType) {
    this.showLoader = true;
    if (actionType == 'delete') {
      this.showString = 'deleted';
      this.language.deleted = true;
    } else {
      this.showString = 'updated';
    }
    if (this.language.id != null) {
      this.metadataService.updateLanguage(this.language).then((response) => {
        this.language = response;
        this.closeModal();
        this.populateLanguage();
        this.showLoader = false;
        this.toastr.successToastr('Language sucessfully ' + this.showString + '!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------1----', error);
      };
    } else {
      this.metadataService.addLanguage(this.language).then((response) => {
        this.language = response;
        this.closeModal();
        this.populateLanguage();
        this.showLoader = false;
        this.toastr.successToastr('Language sucessfully added!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------2----', error);
      };
    }
  }

  openPopup(object, popupForm, objectType, action) {
    this.language = object;
    this.objectType = 'language';
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
