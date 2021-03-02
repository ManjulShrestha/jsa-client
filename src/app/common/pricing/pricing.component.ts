import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalManager} from 'ngb-modal';
import {PopupService} from '../../services/popup.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StripeCardComponent, StripeService} from 'ngx-stripe';
import {StorageService} from '../storage/storage.service';
import {Company} from '../../models/company/company';
import {CompanyService} from '../../services/company.service';
import {CompanyPayments} from '../../models/company/companyPayments';
import {PaymentDetail} from '../../models/company/paymentDetail';
import {ToastrManager} from 'ng6-toastr-notifications';
import {Router} from '@angular/router';
import {LoginService} from '../../services/login.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {
  paymentForm: FormGroup;
  paymentAmount: number;
  showLoader = false;
  description: string;
  companyExist:boolean=false;
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  @ViewChild('paymentModal') paymentModal;
  // elementsOptions: ElementsOptions = {
  //   locale: 'en'
  // };
  // cardOptions: ElementOptions = {
  //   style: {
  //     base: {
  //       iconColor: '#666EE8',
  //       color: '#31325F',
  //       lineHeight: '40px',
  //       fontWeight: 300,
  //       fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
  //       fontSize: '18px',
  //       '::placeholder': {
  //         color: '#CFD7E0'
  //       }
  //     }
  //   }
  // };
  company: Company;
  private modalRef;

  constructor(public modalService: ModalManager,
              private popupService: PopupService,
              private fb: FormBuilder,
              private storageService: StorageService,
              private stripeService: StripeService,
              private companyService: CompanyService,
              private router: Router,
              private toast: ToastrManager,
              private loginService:LoginService
  ) {
  }

  ngOnInit() {
    this.paymentForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]]
    });
    this.company = this.storageService.getCompany();
    if (this.company == null) {
      this.companyExist=false;
    }else{
      this.companyExist=true;
    }


  }

  openPopup(popupForm, amount) {
    this.paymentAmount = amount;
    this.modalRef = this.popupService.openPopup(popupForm);
  }

  closeModal() {
    this.modalService.close(this.modalRef);
  }

  buy(formdata: FormData) {
    this.showLoader = true;
    if (this.paymentAmount == 99) {
      this.description = 'Basic';
    } else if (this.paymentAmount == 250) {
      this.description = 'Standard';
    } else if (this.paymentAmount == 500) {
      this.description = 'Premium';
    } else if (this.paymentAmount == 1000) {
      this.description = 'Golden';
    }
    this.stripeService
      .createToken(this.card.getCard(), {name})
      .subscribe(result => {
        console.log('result is:', result);
        if (result.token) {
          console.log(result.token.id);
          if (result.token.id != null || result.token.id != '') {
            let companyPayment: CompanyPayments = new CompanyPayments();
            this.company.user=this.storageService.getCurrentUser();
            companyPayment.company = this.company;
            let paymentDetail: PaymentDetail = new PaymentDetail();
            paymentDetail.amount = this.paymentAmount;
            paymentDetail.token = result.token.id;
            paymentDetail.description = this.description;
            companyPayment.paymentDetail = paymentDetail;
            companyPayment.paymentAmount= this.paymentAmount;
            console.log('desc', paymentDetail.description);
            console.log('amount', paymentDetail.amount);
            this.companyService.makePayment(companyPayment).then((resrponse => {
              this.closeModal();
              this.showLoader = false;
              this.company.companyPayments.push(resrponse);
              this.storageService.storeCompany(this.company);
              this.toast.successToastr('Payment successful!!!', 'Success!!!', {position: 'top-right'});
              this.loginService.getUserRoles(this.company.user.id).then((response) => {
                this.storageService.storeCurrentUserRoles(response);
              }), (error =>{

              });
              this.router.navigate(['/company/transaction-detail']);
            }), (error => {
              this.toast.successToastr('Some error occurred!!!', 'Oops!!!', {position: 'top-right'});
            }));
          }

        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
  }
}
