import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {StorageServiceModule} from 'angular-webstorage-service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpService} from '../services/http/http.service';
import {Interceptor} from '../services/http/http-request-interceptor';
import {StorageService} from '../common/storage/storage.service';
import {RoutingModule} from './candidate.routing.module';
import {CommonsModule} from '../common/common.module';
import {CommonModule} from '@angular/common';
import { AddResumeComponent } from './add-resume/add-resume.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import {CandidateComponent} from './candidate.component';
import {MetadataService} from '../services/metadata.service';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {ProgressBarModule} from 'angular-progress-bar';
import {MatButtonModule, MatCheckboxModule, MatRadioModule} from '@angular/material';
import { SidebarCandidateComponent } from './sidebar-candidate/sidebar-candidate.component';
import {FileUploadService} from '../services/file-upload.service';
import {ResumeService} from '../services/resume.service';
import {ModalModule} from 'ngb-modal';

@NgModule({
  declarations: [
    CandidateComponent,
    AddResumeComponent,
    DashboardComponent,
    ProfileComponent,
    EditProfileComponent,
    SidebarCandidateComponent,
  ],
  imports: [
    RoutingModule,
    HttpClientModule,
    FormsModule,
    CommonsModule,
    CommonModule,
    ReactiveFormsModule,
    StorageServiceModule,
    AngularMultiSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ProgressBarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    ModalModule
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
    FileUploadService,
    ResumeService
  ],
  exports: [

  ],
  schemas: [
  ],
})
export class CandidateModule {
}
