import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {StorageServiceModule} from 'angular-webstorage-service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpService} from '../services/http/http.service';
import {Interceptor} from '../services/http/http-request-interceptor';
import {StorageService} from '../common/storage/storage.service';
import {CommonsModule} from '../common/common.module';
import {CommonModule} from '@angular/common';
import {MetadataService} from '../services/metadata.service';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';
import {MatButtonModule, MatCheckboxModule, MatRadioModule} from '@angular/material';
import {FileUploadService} from '../services/file-upload.service';
import {RoutingModule} from './admin.routing.module';
import {AgerangeComponent} from './agerange/agerange.component';
import {ToastrModule} from 'ng6-toastr-notifications';
import {AdminComponent} from './admin.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {JobtitleComponent} from './jobtitle/jobtitle.component';
import {EducationLevelComponent} from './education-level/education-level.component';
import {LanguageComponent} from './language/language.component';
import {CareerLevelComponent} from './career-level/career-level.component';
import {CategoryComponent} from './category/category.component';
import {CurrencyComponent} from './currency/currency.component';
import {ModalModule} from 'ngb-modal';
import {CandidatesComponent} from './candidates/candidates.component';
import {CompaniesComponent} from './companies/companies.component';
import {ExperienceRangeComponent} from './experience-range/experience-range.component';
import {IndustryComponent} from './industry/industry.component';


@NgModule({
  declarations: [
    AdminComponent,
    AgerangeComponent,
    DashboardComponent,
    JobtitleComponent,
    EducationLevelComponent,
    LanguageComponent,
    CareerLevelComponent,
    CategoryComponent,
    CurrencyComponent,
    CandidatesComponent,
    CompaniesComponent,
    ExperienceRangeComponent,
    IndustryComponent,
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
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    ModalModule,
    ToastrModule.forRoot()
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
    FileUploadService
  ],
  exports: [],
  schemas: [],
})
export class AdminModule {
}
