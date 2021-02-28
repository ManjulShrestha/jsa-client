import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MetadataService} from '../../services/metadata.service';
import {ToastrManager} from 'ng6-toastr-notifications';
import {Currency} from '../../models/metadata/currency';
import {ModalManager} from 'ngb-modal';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {

  currencyList = [];
  currencyForm: FormGroup;
  currency: Currency;
  objectType: string;
  action: string;
  showLoader = false;
  showString: string;
  @ViewChild('currencyModal') currencyModal;
  private modalRef;


  constructor(
    private metadataService: MetadataService,
    public modalService: ModalManager,
    public toastr: ToastrManager,
  ) {
  }

  ngOnInit() {
    this.populateCountry();
    this.initializeForm();
  }

  initializeForm() {
    this.currencyForm = new FormGroup({
      'nameEnglish': new FormControl(null, Validators.required)
    });
  }

  populateCountry() {
    this.metadataService.getCurrency().then(response => {
      this.currencyList = response;
    }), (error => {
      console.log('error is', error);
    });
  }

  addCurrency(popupName) {
    this.openPopup(new Currency(), popupName, 'currency', 'add');
  }

  saveCurrency(actionType) {
    this.showLoader = true;
    if (actionType == 'delete') {
      this.showString = 'deleted';
      this.currency.deleted = true;
    } else {
      this.showString = 'updated';
    }
    if (this.currency.id != null) {
      this.metadataService.updateCurrency(this.currency).then((response) => {
        this.currency = response;
        this.closeModal();
        this.populateCountry();
        this.showLoader = false;
        this.toastr.successToastr('Country sucessfully ' + this.showString + '!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------1----', error);
      };
    } else {
      this.metadataService.addCurrency(this.currency).then((response) => {
        this.currency = response;
        this.closeModal();
        this.populateCountry();
        this.showLoader = false;
        this.toastr.successToastr('Country sucessfully added!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------2----', error);
      };
    }
  }

  openPopup(object, popupForm, objectType, action) {
    this.currency = object;
    this.objectType = 'currency';
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
