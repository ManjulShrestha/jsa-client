import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {StorageServiceModule} from 'angular-webstorage-service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CompanyRoutingModule} from './company.routing.module';
import {HttpService} from '../services/http/http.service';
import {Interceptor} from '../services/http/http-request-interceptor';
import {StorageService} from '../common/storage/storage.service';
import {CommonsModule} from '../common/common.module';
import {CommonModule} from '@angular/common';
import {CompanyComponent} from './company.component';
import {MetadataService} from '../services/metadata.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import {CompanyService} from '../services/company.service';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { PostJobComponent } from './post-job/post-job.component';
import {JobService} from '../services/job.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { JobListComponent } from './job-list/job-list.component';
import { CompanyListingComponent } from './company-listing/company-listing.component';
import {FileUploadService} from '../services/file-upload.service';
import {NgxStripeModule} from 'ngx-stripe';
import {StripeComponent} from './stripe/stripe.component';
import {ModalModule} from 'ngb-modal';
import {PopupService} from '../services/popup.service';
import {TransactionDetailComponent} from './transaction-detail/transaction-detail.component';
import { AppliedCandidateComponent } from './applied-candidate/applied-candidate.component';
import {CandidateService} from '../services/candidate.service';
import {CandidateListComponent} from './candidate-list/candidate-list.component';
import {CandidateProfileComponent} from './candidate-profile/candidate-profile.component';
import {ProgressBarModule} from 'angular-progress-bar';
import {SlideshowModule} from 'ng-simple-slideshow';
import {AngularFileUploaderModule} from 'angular-file-uploader';
import {FileUploadModule} from 'ng2-file-upload';
import {MatIconModule, MatOptionModule, MatSelectModule} from '@angular/material';

@NgModule({
  declarations: [
    CompanyComponent,
    DashboardComponent,
    ProfileComponent,
    EditProfileComponent,
    PostJobComponent,
    SidebarComponent,
    JobListComponent,
    CompanyListingComponent,
    StripeComponent,
    TransactionDetailComponent,
    AppliedCandidateComponent,
    CandidateListComponent,
    CandidateProfileComponent,
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    CommonsModule,
    CommonModule,
    ReactiveFormsModule,
    StorageServiceModule,
    CompanyRoutingModule,
    AngularMultiSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ModalModule,
    NgxStripeModule.forRoot('pk_test_eyWF42R0mpFzH3Hw45SwoFyN00paNnOsuU'),
    ProgressBarModule,
    SlideshowModule,
    AngularFileUploaderModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    FileUploadModule
  ],
  providers: [
    HttpService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true,
    },
    MetadataService,
    StorageService,
    CompanyService,
    CandidateService,
    JobService,
    FileUploadService,
    PopupService
  ],
  exports: [

  ]
})
export class CompanyModule {
}
