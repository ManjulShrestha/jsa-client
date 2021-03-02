import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/identity/user';
import { UserType } from '../../models/metadata/userType';
import { ConstantMetaData } from '../../constants/ConstantMetaData';
import { Company } from '../../models/company/company';
import { Candidate } from '../../models/candidate/candidate';
import { StorageService } from '../storage/storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CompanyService } from '../../services/company.service';
import { CandidateService } from '../../services/candidate.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent implements OnInit {

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
  showLoader = false;

  user: User = new User();
  signUpUser: User = new User();
  userType: UserType = <UserType>{};
  userTypeid: number;
  candidate = ConstantMetaData.CANDIDATE;
  employer = ConstantMetaData.EMPLOYER;
  company: Company;
  candidateModel: Candidate;
  jobId: number;
  constructor(
    private storageService: StorageService,
    private router: Router,
    private loginService: LoginService,
    private companyService: CompanyService,
    private candidateService: CandidateService,
    private toast: ToastrManager,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.jobId = params['jobId'];
    });
  }

  ngOnInit() {
    this.createSignUpForm();
    this.createLoginForm();
    this.user = this.storageService.getCurrentUser();
    if (this.user != null) {
      this.loginEnable = false;
      this.company = this.storageService.getCompany();
      this.candidateModel = this.storageService.getCandidate();
      if (this.company != null) {
        this.companyEnable = true;
        this.candidateEnable = false;
      }
      if (this.candidateModel != null) {
        this.candidateEnable = true;
        this.companyEnable = false;
      }
    } else {
      this.loginEnable = true;
    }
  }

  private createLoginForm() {
    this.loginForm = new FormGroup({
      'userName': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });
  }
  private createSignUpForm() {
    this.signupForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'contactno': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required),
      'name': new FormControl('', Validators.required),
      'userName': new FormControl(''),
      'confirmPassword': new FormControl('', Validators.required)
    }, { validators: [this.matchPassword, this.checkDuplicateUsername] });
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
      userName: this.userName = this.loginForm["value"]["userName"],
      password: this.password = this.loginForm["value"]["password"]
    };
    this.loginService.login(authentication, this.showLoader).then((res) => {
      res.userType ? this.userTypeid = <number>res.userType.id : null;

      if (res.id) {
        this.loginService.getUserRoles(res.id).then((response) => {
          this.storageService.storeCurrentUser(res);
          this.storageService.setCurrentUserToken(res.token);
          this.storageService.storeCurrentUserRoles(response);
          if (this.userTypeid === ConstantMetaData.CANDIDATE) {
            if (!res.firstTimeLogin) {
              this.candidateService.getCandidateByUser(res.id).then((responseCandidate) => {
                this.storageService.storeCandidate(responseCandidate);
                /*this.showLoader=false;
                this.router.navigateByUrl('/candidate/dashboard').then((response =>{
                  this.showLoader=false;
                }),(error) =>{

                });*/

                if (this.jobId) {
                  this.router.navigateByUrl('/job/view/' + this.jobId);
                } else {
                  window.location.assign('/candidate/dashboard');
                }
              }, (error) => {
                this.showLoader = false;
                this.toast.errorToastr(error, "Error", { position: "top-right" });
              })
            } else {
              window.location.assign('/candidate/edit-profile');
            }
          } else if (this.userTypeid === ConstantMetaData.EMPLOYER) {
            if (!res.firstTimeLogin) {
              this.companyService.getCompanyByUser(res.id).then((responseCompany) => {
                this.storageService.storeCompany(responseCompany);

                window.location.assign('/company/dashboard');
              }, (error) => {
                this.showLoader = false;
                this.toast.errorToastr('No user found!!!', 'Error', {position: 'top-right'});
              })
            } else {
              window.location.assign('/company/edit-profile');
            }

          } else if (this.userTypeid === ConstantMetaData.ADMINISTRATOR) {
            window.location.assign('/admin/dashboard');
          }
        }, (err) => {
          this.showLoader = false;
          this.toast.errorToastr("Could not fetch resources", "Error", { position: "top-right" });
        });

      } else if (res.error) {
        this.showLoader = false;
        this.loginErrorMessage = res.error["error"];
        this.toast.errorToastr(res.error.error, "Login Unsuccessful !!", { positon: "top-right" });
        this.showLoader = false;
      }
    }, (err) => {
      this.showLoader = false;
      this.toast.errorToastr(err, "Login Unsuccessful !!", { positon: "top-right" });
    });
  }

  saveUser() {
    if (!this.userType.id) {
      this.errorMessage = "User type required";
      this.showLoader = false;
      return
    }
    if (!this.signupForm.valid) {
      for (let key in this.signupForm.value) {
        this.signupForm.get(key).markAsTouched();
      }
      this.showLoader = false;
      return;
    }
    let x = this.signupForm["value"]['name'].split(" ");
    console.log(x);
    if (x.length > 2) {
      this.signUpUser.nameEnglish.firstName = x[0];
      this.signUpUser.nameEnglish.middleName = x[1];
      this.signUpUser.nameEnglish.lastName = x[2]
    } else if (x.length > 1) {
      this.signUpUser.nameEnglish.firstName = x[0];
      this.signUpUser.nameEnglish.lastName = x[1];
    } else {
      this.signUpUser.nameEnglish.firstName = x[0];
    }
    this.signUpUser.userType = this.userType;
    this.signUpUser.userName = this.signupForm["value"]["userName"];
    this.signUpUser.email = this.signupForm["value"]["email"];
    this.signUpUser.contactNo = this.signupForm["value"]["contactNo"];
    this.signUpUser.password = this.signupForm["value"]["password"];
    this.loginService.checkEmailDuplication(this.signUpUser.email).then(response => {
      if (!response) {
        this.loginService.signUp(this.signUpUser, this.showLoader).then((res) => {
          this.storageService.storeCurrentUser(res);
          if (res.id) {
            this.loginService.getUserRoles(res.id).then((response) => {
              this.storageService.storeCurrentUserRoles(response);
              if (res.userType.id == ConstantMetaData.CANDIDATE) {
                window.location.assign('/candidate/edit-profile');
              } else if (this.userType.id === ConstantMetaData.EMPLOYER) {
                window.location.assign('/company/edit-profile');
              } else if (this.userTypeid === ConstantMetaData.ADMINISTRATOR) {
                this.router.navigate(['/candidateDashboard']);
              }
            }, (err) => {
              this.toast.errorToastr("Could not fetch resources", "Error", { position: "top-right" });
            });

          }

        }, (err) => {
          this.showLoader = false;
          this.toast.errorToastr(err, "Error", { position: "top-right" });
        });
      } else {
        this.toast.infoToastr("Email already taken", "Duplication", { position: 'top-right' })
        this.usernameTaken = true;
        this.showLoader = false;
      }
    }, (err) => {
      this.showLoader = false;
      this.toast.errorToastr(err, "Error", { position: "top-right" });
    });
  }


  matchPassword(group: FormGroup) {
    let password = group.get('password').value;
    let confirmPassword = group.get('confirmPassword').value;
    if (password != confirmPassword) {
      group.get('confirmPassword').setErrors({ confirmPassword: true });
    } else {
      return null
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


}
