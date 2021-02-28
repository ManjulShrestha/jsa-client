import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { User } from '../../models/identity/user';
import { Company } from '../../models/company/company';
import { Candidate } from '../../models/candidate/candidate';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserType } from '../../models/metadata/userType';
import { ConstantMetaData } from '../../constants/ConstantMetaData';
import { LoginService } from '../../services/login.service';
import { CompanyService } from '../../services/company.service';
import { CandidateService } from '../../services/candidate.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { PopupService } from '../../services/popup.service';
import {MetadataService} from '../../services/metadata.service';
import {Category} from '../../models/metadata/category';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  errorMessage: string;
  loginErrorMessage: string = null;
  userName: String;
  password: String;
  loginForm: FormGroup;
  signupForm: FormGroup;
  usernameTaken: boolean = false;
  loginEnable: boolean = true;
  companyEnable: boolean = false;
  candidateEnable: boolean = false;
  adminEnable: boolean = false;
  showLoader = false;

  user: User = new User();
  signUpUser: User = new User();
  userType: UserType = <UserType>{};
  userTypeid: number;
  candidate = ConstantMetaData.CANDIDATE;
  employer = ConstantMetaData.EMPLOYER;
  company: Company;
  candidateModel: Candidate;
  changePasswordForm: FormGroup;
  currentUser: any;
  categories: Category[] = [];
  usersType: string;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private loginService: LoginService,
    private companyService: CompanyService,
    private candidateService: CandidateService,
    private toast: ToastrManager,
    private popupService: PopupService
  ) {
  }

  ngOnInit() {
    this.createSignUpForm();
    this.createLoginForm();
    this.createChangePasswordForm();
    this.getUserDetails();
  }

  createSignUpForm() {
    this.signupForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'contactno': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required),
      'name': new FormControl('', Validators.required),
      'userName': new FormControl(''),
      'confirmPassword': new FormControl('', Validators.required)
    }, { validators: [this.matchPassword, this.checkDuplicateUsername] });
  }

  createChangePasswordForm() {
    this.changePasswordForm = new FormGroup({
      'password': new FormControl('', [Validators.required]),
      'oldPassword': new FormControl('', [Validators.required]),
      'confirmPassword': new FormControl('', Validators.required),
    }, { validators: [this.matchPassword, this.matchOldAndNewPassword] });
  }

  createLoginForm() {
    this.loginForm = new FormGroup({
      'userName': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });
  }

  getUserDetails() {
    this.user = this.storageService.getCurrentUser();
    if (this.user.userType.id == ConstantMetaData.CANDIDATE) {
      this.usersType = 'candidate';
    }
    if (this.user.userType.id == ConstantMetaData.EMPLOYER) {
      this.usersType = 'employer';
    }
    if (this.user.userType.id == ConstantMetaData.ADMINISTRATOR) {
      this.usersType = 'admin';
    }
    if (this.user != null) {
      this.loginEnable = false;
      this.company = this.storageService.getCompany();
      this.candidateModel = this.storageService.getCandidate();
      if (this.company != null) {
        this.companyEnable = true;
        this.candidateEnable = false;
        this.router.navigate(['/company/dashboard']);
      }
      if (this.candidateModel != null) {
        this.candidateEnable = true;
        this.companyEnable = false;
        this.router.navigate(['/candidate/dashboard']);
      }
      if (this.user.userType.id == 1) {
        this.adminEnable = true;
        this.companyEnable = false;
        this.candidateEnable = false;
        this.router.navigate(['/admin/dashboard']);
      }
      this.showLoader = false;
    } else {
      this.loginEnable = true;
    }
  }

  login(event) {
    if (!this.loginForm.valid) {
      for (let key in this.loginForm.value) {
        this.loginForm.get(key).markAsTouched();
      }
      return;
    }
    this.showLoader = true;
    let authentication = {
      userName: this.userName = this.loginForm['value']['userName'],
      password: this.password = this.loginForm['value']['password']
    };
    this.loginService.login(authentication, this.showLoader).then((res) => {
      res.userType ? this.userTypeid = <number>res.userType.id : null;
      if (res.id) {
        this.loginService.getUserRoles(res.id).then((response) => {
          this.storageService.storeCurrentUserRoles(response);
          this.storageService.storeCurrentUser(res);
          this.storageService.setCurrentUserToken(res.token);
          if (this.userTypeid === ConstantMetaData.CANDIDATE) {
            this.usersType = 'candidate';
            if (!res.firstTimeLogin) {
              this.candidateService.getCandidateByUser(res.id).then((responseCandidate) => {
                this.storageService.storeCandidate(responseCandidate);
                /*this.showLoader=false;
                this.router.navigateByUrl('/candidate/dashboard').then((response =>{
                  this.showLoader=false;
                }),(error) =>{

                });*/
                document.getElementById('loginCloseWindow').click();
                setTimeout(() => {
                  this.getUserDetails();
                }, 2000);
                this.router.navigate(['/candidate/dashboard']);
                //window.location.assign('/candidate/dashboard');
              }, (error) => {
                this.toast.errorToastr(error, 'Error', { position: 'top-right' });
              });
            } else {
              window.location.assign('/candidate/edit-profile');
            }
          } else if (this.userTypeid === ConstantMetaData.EMPLOYER) {
            this.usersType = 'employer';
            if (!res.firstTimeLogin) {
              this.companyService.getCompanyByUser(res.id).then((responseCompany) => {
                this.storageService.storeCompany(responseCompany);
                //window.location.assign('/company/dashboard');
                document.getElementById('loginCloseWindow').click();
                setTimeout(() => {
                  this.getUserDetails();
                }, 2000);
                this.router.navigate(['/company/dashboard']);
              }, (error) => {
                this.toast.errorToastr(error, 'Error', { position: 'top-right' });
              });
            } else {
              window.location.assign('/company/edit-profile');
            }

          } else if (this.userTypeid === ConstantMetaData.ADMINISTRATOR) {
            this.usersType = 'admin';
            document.getElementById('loginCloseWindow').click();
            setTimeout(() => {
              this.getUserDetails();
            }, 2000);
            this.router.navigate(['/admin/dashboard']);

          }
        }, (err) => {
          this.toast.errorToastr('Could not fetch resources', 'Error', { position: 'top-right' });
        });

      } else if (res.error) {
        this.loginErrorMessage = res.error['error'];
        this.toast.errorToastr(res.error.error, 'Login Unsuccessful !!', { positon: 'top-right' });
        this.showLoader = false;
      }
    }, (err) => {
      this.showLoader = false;
      this.toast.errorToastr(err, 'Login Unsuccessful !!', { positon: 'top-right' });
    });
  }

  saveUser() {
    this.showLoader = true;
    if (!this.userType.id) {
      this.errorMessage = 'User type required';
      this.showLoader = false;
      return;
    }
    if (!this.signupForm.valid) {
      for (let key in this.signupForm.value) {
        this.signupForm.get(key).markAsTouched();
      }
      this.showLoader = false;
      return;
    }
    let x = this.signupForm['value']['name'].split(' ');
    console.log(x);
    if (x.length > 2) {
      this.signUpUser.nameEnglish.firstName = x[0];
      this.signUpUser.nameEnglish.middleName = x[1];
      this.signUpUser.nameEnglish.lastName = x[2];
    } else if (x.length > 1) {
      this.signUpUser.nameEnglish.firstName = x[0];
      this.signUpUser.nameEnglish.lastName = x[1];
    } else {
      this.signUpUser.nameEnglish.firstName = x[0];
    }
    this.signUpUser.userType = this.userType;
    this.signUpUser.userName = this.signupForm['value']['userName'];
    this.signUpUser.email = this.signupForm['value']['email'];
    this.signUpUser.contactNo = this.signupForm['value']['contactNo'];
    this.signUpUser.password = this.signupForm['value']['password'];
    this.loginService.checkEmailDuplication(this.signUpUser.email).then(response => {
      if (!response) {
        this.loginService.signUp(this.signUpUser, this.showLoader).then((res) => {
          this.showLoader = false;
          this.storageService.storeCurrentUser(res);
          if (res.id) {
            this.loginService.getUserRoles(res.id).then((response) => {
              this.storageService.storeCurrentUserRoles(response);
              if (res.userType.id == ConstantMetaData.CANDIDATE) {
                this.usersType = 'candidate';
                // this.storageService.storeCandidate(new Candidate());
                document.getElementById('signUpCloseWindow').click();
                setTimeout(() => {
                  this.getUserDetails();
                }, 2000);
                this.router.navigate(['/candidate/edit-profile']);
                //window.location.assign('/candidate/edit-profile');
              } else if (this.userType.id === ConstantMetaData.EMPLOYER) {
                this.usersType = 'employer';
                this.storageService.storeCompany(new Company());
                document.getElementById('signUpCloseWindow').click();
                setTimeout(() => {
                  this.getUserDetails();
                }, 2000);
                this.router.navigate(['/company/edit-profile']);
                //window.location.assign('/company/edit-profile');
              } else if (this.userTypeid === ConstantMetaData.ADMINISTRATOR) {
                this.usersType = 'admin';
                document.getElementById('signUpCloseWindow').click();
                setTimeout(() => {
                  this.getUserDetails();
                }, 2000);
                this.router.navigate(['/candidateDashboard']);
              }
            }, (err) => {
              this.toast.errorToastr('Could not fetch resources', 'Error', { position: 'top-right' });
            });

          }

        }, (err) => {
          this.showLoader = false;
          this.toast.errorToastr(err, 'Error', { position: 'top-right' });
        });
      } else {
        this.toast.infoToastr('Email already taken', 'Duplication', { position: 'top-right' });
        this.usernameTaken = true;
        this.showLoader = false;
      }
    }, (err) => {
      this.showLoader = false;
      this.toast.errorToastr(err, 'Error', { position: 'top-right' });
    });
  }

  matchPassword(group: FormGroup) {
    let password = group.get('password').value;
    let confirmPassword = group.get('confirmPassword').value;
    if (password != confirmPassword) {
      group.get('confirmPassword').setErrors({ confirmPassword: true });
    } else {
      return null;
    }
  }

  matchOldAndNewPassword(group: FormGroup) {
    let password = group.get('password').value;
    let oldPassword = group.get('oldPassword').value;
    if (password == oldPassword) {
      group.get('password').setErrors({ password: true });
    } else {
      return null;
    }
  }

  checkDuplicateUsername(group: FormGroup) {
    let email = group.get('email').value;
    if (email != null && email != '') {
      console.log('email', email);
    }
  }

  public setEmailTaken() {

  }

  public setUserType(userType: any) {
    this.errorMessage = null;
    this.userType.id = <number>(userType);
  }

  logOut() {
    this.storageService.clear();
    window.location.assign('');
  }

  openPopup(popupName) {
    this.popupService.openPopup(popupName);
  }

  saveChangedPassword() {
    this.showLoader = true;
    this.currentUser = this.storageService.getCurrentUser();
    this.currentUser.newPassword = this.changePasswordForm['value']['password'];
    this.currentUser.password = this.changePasswordForm['value']['oldPassword'];
    this.loginService.changePassword(this.currentUser).then(response => {
      this.showLoader = false;
      this.popupService.closePopup();
      this.toast.successToastr('Password change successful!!!', 'Success', { position: 'top-right' });
    }, (error => {
      this.toast.successToastr(error.error.errorMessage, 'Oops!!!', { position: 'top-right' });
      this.showLoader = false;
    }));
  }
}
