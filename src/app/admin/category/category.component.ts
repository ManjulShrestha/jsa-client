import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AgeRange} from '../../models/metadata/ageRange';
import {MetadataService} from '../../services/metadata.service';
import {ToastrManager} from 'ng6-toastr-notifications';
import {Category} from '../../models/metadata/category';
import {ModalManager} from 'ngb-modal';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categoryList = [];
  categoryForm: FormGroup;
  category: Category;
  objectType: string;
  action: string;
  showLoader = false;
  showString: string;
  @ViewChild('categoryModal') categoryModal;
  private modalRef;

  constructor(
    private metadataService: MetadataService,
    public modalService: ModalManager,
    public toastr: ToastrManager,
  ) {
  }

  ngOnInit() {
    this.populateCategory();
    this.initializeForm();
  }

  initializeForm() {
    this.categoryForm = new FormGroup({
      'nameEnglish': new FormControl(null, Validators.required)
    });
  }

  populateCategory() {
    this.metadataService.getCategory().then(response => {
      this.categoryList = response;
    }), (error => {
      console.log('error is', error);
    });
  }

  addCategory(popupName) {
    this.openPopup(new Category(), popupName, 'category', 'add');
  }

  saveCategory(actionType) {
    this.showLoader = true;
    if (actionType == 'delete') {
      this.showString = 'deleted';
      this.category.deleted = true;
    } else {
      this.showString = 'updated';
    }
    if (this.category.id != null) {
      this.metadataService.updateCategory(this.category).then((response) => {
        this.category = response;
        this.closeModal();
        this.populateCategory();
        this.showLoader = false;
        this.toastr.successToastr('Category sucessfully ' + this.showString + '!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------1----', error);
      };
    } else {
      this.metadataService.addCatagory(this.category).then((response) => {
        this.category = response;
        this.closeModal();
        this.populateCategory();
        this.showLoader = false;
        this.toastr.successToastr('Category sucessfully added!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------2----', error);
      };
    }
  }

  openPopup(object, popupForm, objectType, action) {
    this.category = object;
    this.objectType = 'category';
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
