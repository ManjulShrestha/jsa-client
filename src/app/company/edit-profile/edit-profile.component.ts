import {Component, OnInit} from '@angular/core';
import {OnAuthorized} from '../../common/accessManagement/onAuthorize.model';
import {StorageService} from '../../common/storage/storage.service';
import {CompanyService} from '../../services/company.service';
import {DropdownService} from '../../services/dropdown.service';
import {MetadataService} from '../../services/metadata.service';
import {User} from '../../models/identity/user';
import {Company} from '../../models/company/company';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Category} from '../../models/metadata/category';
import {CompanySocialInfo} from '../../models/company/companySocialInfo';
import {CompanyContactInfo} from '../../models/company/companyContactInfo';
import {ConstantMetaData} from '../../constants/ConstantMetaData';
import {FileUploadService} from '../../services/file-upload.service';
// import {validAnimations} from '../../common/animations/validanimations';
import {ToastrManager} from 'ng6-toastr-notifications';
import {CompanyPictures} from '../../models/company/companyPictures';
import {FileUploader} from 'ng2-file-upload';
import {ImageUrl} from '../../models/metadata/imageUrl';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
  animations: [
    // validAnimations

  ]
})
export class EditProfileComponent implements OnInit, OnAuthorized {

  uploadForm: FormGroup;

  showLoader = null;
  dropDownSettingsCategory = {};
  dropdownSettings = {};
  user: User = new User();
  company: Company = new Company();
  companyForm: FormGroup;
  companySocialForm: FormGroup;
  companyContactForm: FormGroup;
  selectedIndustry: any = [];
  selectedTeamSize: any = [];
  selectedCategory: any = [];
  selectedCountry: any = [];
  selectedCity: any = [];
  categorySet: any = [];
  industry = [];
  teamSize = [];
  category = [];
  country = [];
  city = [];
  uploadingFile: boolean = false;
  companyProfilePic: any;
  isImageLoading: boolean = true;
  imageUrls: ImageUrl[] = [];
  j: number = 0;

  public uploader: FileUploader = new FileUploader({
    isHTML5: true
  });

  constructor(private storageService: StorageService,
              private companyService: CompanyService,
              private commonService: DropdownService,
              private metadataService: MetadataService,
              private fileUploadService: FileUploadService,
              public toastr: ToastrManager, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.initializeForm();
    this.setDropDowns();
    this.setDropDownsCategory();
    this.populateDropDown();
    this.populateCompany();
    this.fetchCarouselPhotos();
    this.uploadForm = this.fb.group({
      document: [null, null],
    });
    this.j = 0;

  }

  uploadSubmit() {
    this.showLoader = true;
    for (let i = 0; i < this.uploader.queue.length; i++) {
      let fileItem = this.uploader.queue[i]._file;
      if (fileItem.size > 10000000) {
        alert('Each File should be less than 10 MB of size.');
        this.showLoader = false;
        return;
      }
    }
    // for (let j = 0; j < this.uploader.queue.length; j++) {
      let data = new FormData();
    let fileItem = this.uploader.queue[this.j]._file;
      data.append('name', fileItem);
      this.fileUploadService.uploadFile(fileItem.name, data).then(
        value => {
          this.showLoader = false;
          let companyPictures = new CompanyPictures();
          companyPictures.path = value.message;
          this.company.companyPictures.push(companyPictures);
        }
      ), (error) => {
        console.log('oooooooops', error);
      };
    // }
    this.j++;
  }

  onAuthorized() {
    /* this.initializeForm();
     this.populateCompany();
     this.populateDropDown();*/
  }

  populateCompany() {
    this.company = this.storageService.getCompany();
    if (this.company != null) {
      this.company.startDate = new Date(this.company.startDate);
      if (this.company.companySocialInfo == null) {
        this.company.companySocialInfo = new CompanySocialInfo();
      }
      if (this.company.companyContactInfo == null) {
        this.company.companyContactInfo = new CompanyContactInfo();
      }
      if (this.company.industry != null) {
        this.selectedIndustry.push({ id: this.company.industry.id, data: this.company.industry, itemName: this.company.industry.nameEnglish })
      }
      if (this.company.teamSize != null) {
        this.selectedTeamSize.push({ id: this.company.teamSize.id, data: this.company.teamSize, itemName: this.company.teamSize.nameEnglish })
      }
      if (this.company.categorySet != null) {
        this.company.categorySet.map((value) => {
          this.selectedCategory.push({ id: value.id, data: value, itemName: value.nameEnglish })
        });
      }
      if (this.company.companyContactInfo.country != null) {
        this.selectedCountry.push({ id: this.company.companyContactInfo.country.id, data: this.company.companyContactInfo.country, itemName: this.company.companyContactInfo.country.nameEnglish })
      }
      if (this.company.picturePath != null) {
        this.getImageFromService(this.company.picturePath);
      }
    } else {
      this.company = new Company();
    }

  }

  populateDropDown() {
    this.industry = this.commonService.populateDropdown(this.metadataService.getIndustry(), this.industry);
    this.category = this.commonService.populateDropdown(this.metadataService.getCategory(), this.category);
    this.country = this.commonService.populateDropdown(this.metadataService.getCountry(), this.country);
    this.city = this.commonService.populateDropdown(this.metadataService.getCity(), this.city);
    this.teamSize = this.commonService.populateDropdown(this.metadataService.getTeamSize(), this.teamSize);
  }

  initializeForm() {
    this.companyForm = new FormGroup({
      'companyName': new FormControl(null, Validators.required),
      'since': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'teamSize': new FormControl(null, Validators.required),
      'industry': new FormControl(null, Validators.required),
      'category': new FormControl(null, Validators.required)

    });
    this.companySocialForm = new FormGroup({
      'facebook': new FormControl(null, Validators.required),
      'twitter': new FormControl(null, Validators.required),
      'google': new FormControl(null, Validators.required),
      'linkedIn': new FormControl(null, Validators.required)
    });
    this.companyContactForm = new FormGroup({
      'phoneNumber': new FormControl(null, Validators.required),
      'email': new FormControl(null, Validators.required),
      'website': new FormControl(null, Validators.required),
      'mapDetail': new FormControl(null, Validators.required),
      'latitude': new FormControl(null, Validators.required),
      'longitude': new FormControl(null, Validators.required),
      'country': new FormControl(null, Validators.required),
      'city': new FormControl(null, Validators.required)

    })
  }

  submit() {
    /*if (!this.companyForm.valid) {
      /!*this.notificationService.error('Error', 'Please fill all the fields');*!/
      for (let key in this.companyForm.value) {
        for (let key2 in this.companyForm.get(key)['controls']) {
          this.companyForm.get(key + "." + key2).markAsTouched();
        }


      }
      event.resolve();
      return;
    }*/
    this.showLoader = true;
    this.uploader.queue = [];      // for images queue;
    this.company.user = this.storageService.getCurrentUser();
    if (this.selectedIndustry.length > 0) {
      this.company.industry = this.selectedIndustry[0].data;
    }
    if (this.selectedTeamSize.length > 0) {
      this.company.teamSize = this.selectedTeamSize[0].data;
    }
    if (this.selectedCategory.length > 0) {
      this.selectedCategory.map(
        (value) => {
          this.categorySet.push(value.data);
        }
      );
      this.company.categorySet = this.categorySet;
    }
    if (this.selectedCountry.length > 0) {
      this.company.companyContactInfo.country = this.selectedCountry[0].data;
    }
    if (this.selectedCity.length > 0) {
      this.company.companyContactInfo.city = this.selectedCity[0].data;
    }
    if (this.company.id != null) {
      this.companyService.updateCompany(this.company).then((response) => {

        this.company = response;
        this.storageService.storeCompany(this.company);
        this.company.startDate = new Date(this.company.startDate);
        this.fetchCarouselPhotos();
        this.showLoader = false;
        this.toastr.successToastr('Profile successfully updated!!!', 'Success!', {
          position: 'top-right'
        });
      }, (error) => {
        this.showLoader = false;
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log(error);
      });
    } else {
      this.companyService.addCompany(this.company).then((response) => {

        this.company = response;
        this.storageService.storeCompany(this.company);
        this.company.startDate = new Date(this.company.startDate);
        this.showLoader = false;
        this.toastr.successToastr('Company successfully updated!!!', 'Success!', {
          position: 'top-right'
        });
      }, (error) => {
        this.showLoader = false;
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
      });
    }
  }

  photoUpload(event) {

    let file = event.target.files[0];
    if (this.checkFileSize(file)) {
      this.uploadingFile = true;
      let formData = new FormData();
      formData.append("name", file);

      this.fileUploadService.uploadFile(file.name, formData).then(
        value => {
          this.company.picturePath = value.message;
          this.submit();
          this.getImageFromService(this.company.picturePath);
        }
      );
    } else {

    }
  }

  checkFileSize(document) {

    return document.size <= ConstantMetaData.MAX_FILE_SIZE;

  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    /* reader.addEventListener("load", () => {
       this.companyProfilePic = reader.result;
     }, false);*/

    if (image) {
      reader.readAsDataURL(image);
      reader.onload = (event) => { // called once readAsDataURL is completed
        console.log(event);
        this.companyProfilePic = reader.result;
      }
    }
  }

  getImageFromService(filePath: String) {
    this.isImageLoading = true;
    this.fileUploadService.viewFile(filePath).then((response) => {
      this.createImageFromBlob(response);
      this.isImageLoading = false;
    }, (error) => {
      this.isImageLoading = false;
      console.log(error);
    });
  }

  isFieldValid(field: string, form: FormGroup) {
    let result: boolean = !form.get(field).valid && form.get(field).touched;
    return result;
  }

  setDropDowns() {
    this.dropdownSettings = {
      singleSelection: true,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: false,
      enableCheckAll: false,
      showCheckbox: true,
      searchPlaceholderText: 'Search',
    };
  }

  setDropDownsCategory() {
    this.dropDownSettingsCategory = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };
  }

  onAddItem(event) {
    this.commonService.onAddItem(event, this.category, this.selectedCategory);
  }

  fetchCarouselPhotos() {
    this.imageUrls = [];
    this.company.isImageLoading = true;
    this.company.companyPictures.forEach(carouselPicture => {
      if (!carouselPicture.deleted) {
        this.fileUploadService.viewFile('thumb_' + carouselPicture.path).then((resp) => {
          let reader = new FileReader();
          if (resp) {
            reader.readAsDataURL(resp);
            var imageUrl = new ImageUrl();
            reader.onload = (event) => {
              imageUrl.companyPicture = carouselPicture;
              imageUrl.picture = reader.result;
              this.imageUrls.push(
                imageUrl
              );

            };
          }
        });
      }
    });
  }

  deletePhotos(companyPictures) {
    this.company.companyPictures.forEach(carouselPicture => {
      if (!carouselPicture.deleted) {

        if (carouselPicture.id == companyPictures.id) {
          carouselPicture.deleted = true;

          this.submit();

        }
      }
    });
  }
}
