import { Component, OnInit } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {User} from '../../models/identity/user';
import {StorageService} from '../../common/storage/storage.service';
import {ConstantMetaData} from '../../constants/ConstantMetaData';
import {Candidate} from '../../models/candidate/candidate';
import {Router} from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-sidebar-candidate',
  templateUrl: './sidebar-candidate.component.html',
  styleUrls: ['./sidebar-candidate.component.css']
})
export class SidebarCandidateComponent implements OnInit {

  user: User;
  candidate: Candidate;

  constructor(private toastr: ToastrManager,
              private storageService: StorageService,
              private router: Router) {
  }

  ngOnInit() {
    $('.tree_widget-sec > ul > li.inner-child:first > ul').slideDown();
    $('.tree_widget-sec > ul > li.inner-child:first').addClass('active');
    $('.tree_widget-sec > ul > li.inner-child > a').on('click', function(){
      $('.tree_widget-sec > ul > li.inner-child').removeClass('active');
      $('.tree_widget-sec > ul > li > ul').slideUp();
      $(this).parent().addClass('active');
      $(this).next('ul').slideDown();
      return false;
    });
    this.candidate = this.storageService.getCandidate();
    this.user = this.storageService.getCurrentUser();
  }

  checkRedirect() {
    if (this.user && !this.candidate) {
      if (this.user.userType.id == ConstantMetaData.CANDIDATE) {
        this.toastr.infoToastr('Please create your profile first', 'Info!!!', {position: 'top-right'});
        this.router.navigateByUrl('/candidate/edit-profile');
      }
    } else {
      this.router.navigateByUrl('/candidate/profile');
    }
  }
}
