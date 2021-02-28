import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IndexComponent} from './index/index.component';
import {AboutComponent} from './common/about/about.component';
import {ContactComponent} from './common/contact/contact.component';
import {FaqComponent} from './common/faq/faq.component';
import {PricingComponent} from './common/pricing/pricing.component';
import {HowItWorksComponent} from './common/how-it-works/how-it-works.component';
import {TermsAndConditionComponent} from './common/terms-and-condition/terms-and-condition.component';
import {LoginRegisterComponent} from './common/login-register/login-register.component';

const routes: Routes = [
  {path: '' , component : IndexComponent},
  {path: 'about' , component : AboutComponent},
  {path: 'contact' , component : ContactComponent},
  {path: 'faq' , component : FaqComponent},
  {path: 'pricing' , component : PricingComponent},
  {path: 'how-it-works' , component : HowItWorksComponent},
  {path: 'terms-and-condition' , component : TermsAndConditionComponent},
  {path: 'login-register' , component : LoginRegisterComponent},
  {path: 'candidate' , loadChildren: './candidate/candidate.module#CandidateModule', data: { preload: true }},
  {path: 'company' , loadChildren: './company/company.module#CompanyModule', data: { preload: true }},
  {path: 'job', loadChildren: './job/job.module#JobModule', data: {preload: true}},
  {path: 'admin', loadChildren: './admin/admin.module#AdminModule', data: {preload: true}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
