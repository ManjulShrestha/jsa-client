import { AccessManager } from './accessManagement/accessManagement.service';
import { AccessManagerDirective } from './accessManagement/accessManagement.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import {RbacService} from "./rbac/rbac.service";
import {StorageService} from "./storage/storage.service";
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import {ProgressDirective} from './progress/progress.directive';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { PricingComponent } from './pricing/pricing.component';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LoginRegisterComponent } from './login-register/login-register.component';
import {ModalModule} from 'ngb-modal';
import {NgxStripeModule} from 'ngx-stripe';
import {CompanyService} from '../services/company.service';
import {MetadataService} from '../services/metadata.service';
import {MatCheckboxModule} from '@angular/material';

@NgModule({
	imports: [
	  CommonModule,
		RouterModule,
		FormsModule,
    ReactiveFormsModule,
    ModalModule,
    NgxStripeModule.forRoot('pk_test_JigdX00I0okhTuzAPFwct6Zw00NrYF3klA'),
    MatCheckboxModule
  ],
	declarations: [
		AccessManagerDirective,
		FooterComponent,
		HeaderComponent,
    ProgressDirective,
    AboutComponent,
    ContactComponent,
    FaqComponent,
    HowItWorksComponent,
    PricingComponent,
    TermsAndConditionComponent,
    LoginRegisterComponent,

	],
	exports: [
		AccessManagerDirective,
    FooterComponent,
    HeaderComponent,
    ProgressDirective
	],
	providers: [
		AccessManager,
		RbacService,
		StorageService,
    CompanyService,
    MetadataService

	],
})
export class CommonsModule { }
