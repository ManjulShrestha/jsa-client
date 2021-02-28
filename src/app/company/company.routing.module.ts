import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CompanyComponent} from './company.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ProfileComponent} from './profile/profile.component';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {PostJobComponent} from './post-job/post-job.component';
import {JobListComponent} from './job-list/job-list.component';
import {CompanyListingComponent} from './company-listing/company-listing.component';
import {StripeComponent} from './stripe/stripe.component';
import {TransactionDetailComponent} from './transaction-detail/transaction-detail.component';
import {AppliedCandidateComponent} from './applied-candidate/applied-candidate.component';
import {CandidateListComponent} from './candidate-list/candidate-list.component';
import {CandidateProfileComponent} from './candidate-profile/candidate-profile.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',component: CompanyComponent,
        children:[
          {path: 'dashboard', component: DashboardComponent, pathMatch:'full'},
          {path: 'profile/:id', component: ProfileComponent, pathMatch:'full'},
          {path: 'edit-profile', component: EditProfileComponent, pathMatch:'full'},
          {path: 'post-job/:id', component: PostJobComponent, pathMatch:'full'},
          {path: 'list-job', component: JobListComponent, pathMatch:'full'},
          {path: 'list', component: CompanyListingComponent, pathMatch: 'full'},
          {path: 'stripe', component: StripeComponent, pathMatch: 'full'},
          {path: 'applied', component: AppliedCandidateComponent, pathMatch: 'full'},
          {path: 'transaction-detail', component: TransactionDetailComponent, pathMatch: 'full'},
          {path: 'candidate-list', component: CandidateListComponent, pathMatch: 'full'},
          {path: 'candidate-profile/:id', component: CandidateProfileComponent, pathMatch: 'full'}
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class CompanyRoutingModule {

}
