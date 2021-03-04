import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Company} from '../../models/company/company';
import {MetadataService} from '../../services/metadata.service';
import {CompanyService} from '../../services/company.service';
import {ModalManager} from 'ngb-modal';
import {ToastrManager} from 'ng6-toastr-notifications';
import {PopupService} from '../../services/popup.service';
import {Candidate} from '../../models/candidate/candidate';
import {FileUploadService} from '../../services/file-upload.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {

  companyForm: FormGroup;
  company: Company;
  objectType: string;
  action: string;
  showLoader = false;
  showString: string;
  @ViewChild('companyModal') companyModal;
  size = 10;
  page = 0;
  companys: Company[] = [];
  totalCompany: number;
  private modalRef;

  constructor(
    private metadataService: MetadataService,
    private companyService: CompanyService,
    public modalService: ModalManager,
    public toastr: ToastrManager,
    private popupService: PopupService,
    private fileUploadService: FileUploadService
  ) {
  }

  ngOnInit() {
    this.populateCompanyList();
    this.getTotalCompany();
    this.initializeForm();
  }

  initializeForm() {
    this.companyForm = new FormGroup({
      'nameEnglish': new FormControl(null, Validators.required)
    });
  }

  populateCompanyList() {
    this.showLoader = true;
    this.companyService.getCompanies(this.page++, this.size).then(
      (response) => {
        if (this.companys.length == 0) {
          this.companys = response;
        } else {
          this.companys = this.companys.concat(response);
        }
        this.showLoader = false;
        this.fetchCompanyPhotos(this.companys);

      }, (error) => {
        console.log(error);
      });
  }

  getTotalCompany() {
    this.companyService.getCompanyCount().then(
      (response => {
        this.totalCompany = response;
      }), (error => {
        console.log(error);
      })
    );
  }

  addCompany(popupName) {
    this.openPopup(new Company(), popupName, 'company', 'add');
  }

  saveCompany(actionType) {
    this.showLoader = true;
    if (actionType == 'delete') {
      this.showString = 'deleted';
      this.company.deleted = true;
    } else {
      this.showString = 'updated';
    }
    if (this.company.id != null) {
      this.companyService.updateCompany(this.company).then((response) => {
        this.company = response;
        this.closeModal();
        this.populateCompanyList();
        this.showLoader = false;
        this.toastr.successToastr('Company sucessfully ' + this.showString + '!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------1----', error);
      };
    } else {
      this.companyService.addCompany(this.company).then((response) => {
        this.company = response;
        this.closeModal();
        this.populateCompanyList();
        this.showLoader = false;
        this.toastr.successToastr('Company sucessfully added!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------2----', error);
      };
    }
  }

  openPopup(object, popupForm, objectType, action) {
    this.company = object;
    this.objectType = 'company';
    this.setAction(action);
    this.modalRef = this.popupService.openPopup(popupForm);
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

  fetchCompanyPhotos(companys: Company[]){
    let fileUploadService= this.fileUploadService;
    companys.forEach(function (company) {
      company.isImageLoading = true;
      if (company.picturePath != null){
        fileUploadService.viewFile('thumb_'+company.picturePath).then((response) => {
          let reader = new FileReader();
          if (response) {
            reader.readAsDataURL(response);
            reader.onload = (event) => {
              console.log(event);
              company.companyProfilePic = reader.result;
            }
          }
          company.isImageLoading = false;
        }, (error) => {
          company.isImageLoading = true;
          console.log(error);
        });
      }
    })
  }

}
