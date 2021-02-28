import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {JobComponent} from './job.component';
import {JobListingComponent} from './job-listing/job-listing.component';
import {JobDetailComponent} from './job-detail/job-detail.component';

const routes: Routes = [
  {
    path: '',component: JobComponent,
    children:[
      {path: 'list/:id', component: JobListingComponent, pathMatch: 'full'},
      {path: 'view/:id', component: JobDetailComponent, pathMatch:'full'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobRoutingModule { }
