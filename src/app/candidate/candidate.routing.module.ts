import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CandidateComponent} from './candidate.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ProfileComponent} from './profile/profile.component';
import {EditProfileComponent} from './edit-profile/edit-profile.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',component: CandidateComponent,
        children:[
          {path: 'dashboard', component: DashboardComponent, pathMatch:'full'},
          // {path: 'add-resume', component: AddResumeComponent, pathMatch:'full'},
          {path: 'profile', component: ProfileComponent, pathMatch: 'full'},
          {path: 'edit-profile', component: EditProfileComponent, pathMatch: 'full'},
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class RoutingModule {
  
}
