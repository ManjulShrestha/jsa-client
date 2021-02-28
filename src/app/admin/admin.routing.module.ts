import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AdminComponent} from './admin.component';
import {AgerangeComponent} from './agerange/agerange.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {JobtitleComponent} from './jobtitle/jobtitle.component';
import {EducationLevelComponent} from './education-level/education-level.component';
import {LanguageComponent} from './language/language.component';
import {CareerLevelComponent} from './career-level/career-level.component';
import {CategoryComponent} from './category/category.component';
import {CurrencyComponent} from './currency/currency.component';
import {CompaniesComponent} from './companies/companies.component';
import {CandidatesComponent} from './candidates/candidates.component';
import {ExperienceRangeComponent} from './experience-range/experience-range.component';
import {IndustryComponent} from './industry/industry.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: AdminComponent,
        children: [
          {path: 'dashboard', component: DashboardComponent, pathMatch: 'full'},
          {path: 'age-range', component: AgerangeComponent, pathMatch: 'full'},
          {path: 'job-title', component: JobtitleComponent, pathMatch: 'full'},
          {path: 'education-level', component: EducationLevelComponent, pathMatch: 'full'},
          {path: 'language', component: LanguageComponent, pathMatch: 'full'},
          {path: 'career-level', component: CareerLevelComponent, pathMatch: 'full'},
          {path: 'category', component: CategoryComponent, pathMatch: 'full'},
          {path: 'currency', component: CurrencyComponent, pathMatch: 'full'},
          {path: 'candidates', component: CandidatesComponent, pathMatch: 'full'},
          {path: 'companies', component: CompaniesComponent, pathMatch: 'full'},
          {path: 'experience-range', component: ExperienceRangeComponent, pathMatch: 'full'},
          {path: 'industry', component: IndustryComponent, pathMatch: 'full'},
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class RoutingModule {

}
