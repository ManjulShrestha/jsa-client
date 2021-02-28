import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobRoutingModule } from './job-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonsModule} from '../common/common.module';
import {StorageServiceModule} from 'angular-webstorage-service';
import {HttpService} from '../services/http/http.service';
import {Interceptor} from '../services/http/http-request-interceptor';
import {MetadataService} from '../services/metadata.service';
import {StorageService} from '../common/storage/storage.service';
import {CompanyService} from '../services/company.service';
import {JobService} from '../services/job.service';
import {JobComponent} from './job.component';
import { JobListingComponent } from './job-listing/job-listing.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import {ScriptService} from '../common/script.service';
import {FileUploadService} from '../services/file-upload.service';

@NgModule({
  declarations: [JobComponent, JobListingComponent, JobDetailComponent],
  imports: [
    CommonModule,
    JobRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonsModule,
    ReactiveFormsModule,
    StorageServiceModule,
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
    JobService,
    ScriptService,
    FileUploadService
  ],
  exports: [

  ]
})
export class JobModule { }
