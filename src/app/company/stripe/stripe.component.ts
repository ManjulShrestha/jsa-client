import {Component, OnInit, ViewChild} from '@angular/core';
import { StripeService, StripeCardComponent} from 'ngx-stripe';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalManager} from 'ngb-modal';
import {PopupService} from '../../services/popup.service';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.css']
})
export class StripeComponent implements OnInit {

  //elements: Elements;
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  @ViewChild('paymentModal') paymentModal;
  // optional parameters
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
  paymentForm: FormGroup;
  private modalRef;

  constructor(
    public modalService: ModalManager,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private popupService: PopupService
  ) {
  }

  ngOnInit() {
    this.paymentForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]]
    });
  }

  buy(formdata: FormData) {
    this.stripeService
      .createToken(this.card.getCard(), {name})
      .subscribe(result => {
        console.log('result is:', result);
        if (result.token) {
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
          // const headers = new HttpHeaders()
          //   .set('Content-Type', 'application/json');
          console.log(result.token.id);
          let obj = {
            token: result.token.id,
            email: formdata['email'],
            user: formdata['name']
          };
          console.log('obj is', obj);
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
  }

  openPopup(popupForm) {
    this.modalRef = this.popupService.openPopup(popupForm);
  }

  closeModal() {
    this.modalService.close(this.modalRef);
  }
}
