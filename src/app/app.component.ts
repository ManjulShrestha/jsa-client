import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {StorageService} from './common/storage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'divisionclient';

  constructor(private router: Router, private storageService: StorageService) {
  }

  ngOnInit() {
    /*if (this.storageService.getCandidate() != null) {
      this.router.navigateByUrl('/candidate/dashboard');
    }
    if (this.storageService.getCompany() != null) {
      this.router.navigateByUrl('/company/dashboard');
    }*/
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }
}
