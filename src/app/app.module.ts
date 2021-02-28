import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { Interceptor } from './services/http/http-request-interceptor';
import { HttpService } from './services/http/http.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { StorageService } from './common/storage/storage.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StorageServiceModule } from 'angular-webstorage-service';
import { LoginService } from './services/login.service';
import { CommonsModule } from './common/common.module';
import { MetadataService } from './services/metadata.service';
import { CompanyService } from './services/company.service';
import { CandidateService } from './services/candidate.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { JobService } from './services/job.service';
import { ModalComponent } from './index/modal.component';
import { ToastrModule } from 'ng6-toastr-notifications';

const PROVIDE_ENVIRONMENT = '@@environment';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    StorageServiceModule,
    CommonsModule,
    MatCheckboxModule,
    MatButtonModule,
    ToastrModule.forRoot()
  ],
  providers: [
    { provide: PROVIDE_ENVIRONMENT, useValue: environment },
    HttpService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true,
    },
    ApiService,
    LoginService,
    MetadataService,
    CompanyService,
    CandidateService,
    StorageService,
    JobService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
