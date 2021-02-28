import {Component, OnInit, ViewChild} from '@angular/core';
import {OnAuthorized} from '../../common/accessManagement/onAuthorize.model';
import {Company} from '../../models/company/company';
import {StorageService} from '../../common/storage/storage.service';
import {CompanyService} from '../../services/company.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Candidate} from '../../models/candidate/candidate';
import {FileUploadService} from '../../services/file-upload.service';
import {IImage} from 'ng-simple-slideshow';
import {User} from '../../models/identity/user';
import {ConstantMetaData} from '../../constants/ConstantMetaData';
import {ToastrManager} from 'ng6-toastr-notifications';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']

})
export class ProfileComponent implements OnInit, OnAuthorized {

  imageUrls: (string | IImage)[] = [];
  height: string = '400px';
  minHeight: string;
  arrowSize: string = '30px';
  showArrows: boolean = true;
  disableSwiping: boolean = false;
  autoPlay: boolean = true;
  autoPlayInterval: number = 3333;
  stopAutoPlayOnSlide: boolean = true;
  debug: boolean = false;
  backgroundSize: string = 'cover';
  backgroundPosition: string = 'center center';
  backgroundRepeat: string = 'no-repeat';
  showDots: boolean = true;
  dotColor: string = '#FFF';
  showCaptions: boolean = true;
  captionColor: string = '#FFF';
  captionBackground: string = 'rgba(0, 0, 0, .35)';
  lazyLoad: boolean = false;
  hideOnNoSlides: boolean = false;
  width: string = '100%';
  fullscreen: boolean = false;

  company: Company = new Company();
  isCompany: boolean = false;
  candidate: Candidate;
  follow: String = 'Follow us';
  showLoader: boolean = false;
  user: User;

  constructor(private storageService: StorageService,
              private route: ActivatedRoute,
              private companyService: CompanyService,
              private router: Router,
              private fileUploadService: FileUploadService,
              private toastr: ToastrManager) {
  }

  ngOnInit() {
    this.checkHeader();
    this.candidate = this.storageService.getCandidate();
    this.user = this.storageService.getCurrentUser();
  }

  onAuthorized() {
  }

  populateCompany() {
    this.company = this.storageService.getCompany();
  }

  checkHeader() {
    this.showLoader = true;
    this.route.params.subscribe(
      (params) => {
        // Defaults to 0 if no query param provided.
        let id = +params['id'] || 0;
        if (id != 0) {
          this.companyService.getCompanyById(id).then((response => {
            this.company = response;
            this.isCompany = false;
            this.fetchCompanyPhotos();
            this.fetchCarouselPhotos();
            this.showLoader = false;
          }), (error => {
            console.log(error);
            this.showLoader = false;
          }));
        } else {
          this.company = this.storageService.getCompany();
          this.fetchCompanyPhotos();
          this.fetchCarouselPhotos();
          this.isCompany = true;
          this.showLoader = false;
        }

      }
    );
  }

  followCompany() {
    if (this.user && !this.candidate) {
      if (this.user.userType.id == ConstantMetaData.CANDIDATE) {
        this.toastr.infoToastr('Please create your profile first', 'Info!!!', {position: 'top-right'});
        this.router.navigateByUrl('/candidate/edit-profile');
      }
    } else if (!this.candidate && !this.user) {
      this.toastr.infoToastr('Please login first', 'Info!!!', {position: 'top-right'});
      this.router.navigateByUrl('/login-register');
    } else {
      this.companyService.followCompany(this.company.id, this.candidate).then((response => {
        if (response) {
          this.follow = 'Followed';
        } else {
          this.follow = 'Already Followed';
        }
      }), (error => {
      }));
    }
  }

  viewCompany() {
    if (!this.isCompany) {
      this.companyService.viewCompany(this.company.id, this.candidate).then((response => {
      }), (error => {
      }));
    }

  }

  fetchCompanyPhotos() {

    this.company.isImageLoading = true;
    this.fileUploadService.viewFile('thumb_' + this.company.picturePath).then((response) => {
      let reader = new FileReader();
      if (response) {
        reader.readAsDataURL(response);
        reader.onload = (event) => {
          console.log(event);
          this.company.companyProfilePic = reader.result;
        };
      }
      this.company.isImageLoading = false;
    }, (error) => {
      this.company.isImageLoading = true;
      console.log(error);
    });

  }

  fetchCarouselPhotos() {
    this.company.isImageLoading = true;
    this.company.companyPictures.forEach(carouselPicture => {
      if (!carouselPicture.deleted) {
        this.fileUploadService.viewFile(carouselPicture.path).then((resp) => {
          let reader = new FileReader();
          if (resp) {
            reader.readAsDataURL(resp);
            reader.onload = (event) => {
              this.imageUrls.push({
                url: reader.result.toString(),
                // caption: 'The first slide',
                href: '#config'
              });

            };
          }
        });
      }
    });
  }
}
