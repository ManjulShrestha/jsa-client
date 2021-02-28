import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company/company';
import { FileUploadService } from '../../services/file-upload.service';
import { MetadataService } from '../../services/metadata.service';
import { StorageService } from '../../common/storage/storage.service';
import { Job } from '../../models/company/job';
declare var $: any;
@Component({
  selector: 'app-company-listing',
  templateUrl: './company-listing.component.html',
  styleUrls: ['./company-listing.component.css']
})
export class CompanyListingComponent implements OnInit {

  companies: Company[] = [];
  page: number = 1;
  size: number = 10;
  teamSize = [];
  category = [];
  selectedSpecialism: number[] = [];
  selectedTeamSize: number[] = [];
  filteredCompanies: Company[] = [];
  showLoader:boolean =false;
  constructor(private companyService: CompanyService,
    private fileUploadService: FileUploadService,
    private storageService: StorageService,
    private metadataService: MetadataService) { }

  ngOnInit() {
    this.populateMetadata();
    this.populateCompanyList();
    $('.sb-title.open').next().slideDown();
    $('.sb-title.closed').next().slideUp();
    $('.sb-title').on('click', function () {
      $(this).next().slideToggle();
      $(this).toggleClass('active');
      $(this).toggleClass('closed');
    });

  }
  allData() {
    this.filteredCompanies = this.companies;
  }

  populateCompanyList() {
    this.showLoader=true;
    this.companyService.getCompanies(this.page++, this.size).then(
      (response) => {
        if (this.companies.length == 0) {
          this.companies = response;
          this.fetchCompanyPhotos(this.companies);
        } else {
          this.companies = this.companies.concat(response);
        }
        let candidate = this.storageService.getCandidate();
        if (candidate != null) {
          this.companies.forEach(function (company) {

            if (company.candidateFollowSetId.includes(candidate.id)) {
              company.following = true;
            }
          });
        }
        this.companies.sort(function (a, b) {
          return (a.following === b.following) ? 0 : a.following ? -1 : 1;
        })
        this.filteredCompanies = this.companies;
        this.showLoader=false;
      }, (error) => {
        console.log(error);
        this.showLoader=false;
      });
  }

  fetchCompanyPhotos(companies: Company[]) {
    let fileUploadService = this.fileUploadService;
    companies.forEach(function (company) {
      company.isImageLoading = true;
      if (company.picturePath != null) {
        fileUploadService.viewFile('thumb_' + company.picturePath).then((response) => {
          let reader = new FileReader();
          if (response) {
            reader.readAsDataURL(response);
            reader.onload = (event) => {
              console.log(event);
              company.companyProfilePic = reader.result;
            }
          }
          company.isImageLoading = false;
        }, (error) => {
          company.isImageLoading = true;
          console.log(error);
        });
      }
    })
  }

  populateMetadata() {
    this.metadataService.getCategory().then((response => {
      this.category = response;
    }), (error => {

    }));
    this.metadataService.getTeamSize().then((response => {
      this.teamSize = response;
    }), (error => {

    }));
  }

  selectSpecialism($event, obj) {
    let filteredCompanies: Company[] = [];
    let selectedSpecialism;

    if ($event.target.checked === true) {
      this.selectedSpecialism.push(obj.id);
      selectedSpecialism = this.selectedSpecialism;

      this.companies.forEach(function (company) {
        let category: number[] = [];
        company.categorySet.forEach(function (value) {
          category.push(value.id);
        });
        selectedSpecialism.forEach(function (specialism) {
          if (category.includes(specialism)) {
            if (filteredCompanies.indexOf(company) < 0) {
              filteredCompanies.push(company);
            }
          }
        });
      });
    } else {
      let index = this.selectedSpecialism.indexOf(obj.id);
      this.selectedSpecialism.splice(index, 1);
      selectedSpecialism = this.selectedSpecialism;
      this.companies.forEach(function (company) {
        let category: number[] = [];
        company.categorySet.forEach(function (value) {
          category.push(value.id);
        });
        selectedSpecialism.forEach(function (specialism) {
          if (category.includes(specialism)) {
            filteredCompanies.push(company);
          }
        });
      });
    }
    this.filteredCompanies = filteredCompanies;
  }

  selectTeamSize($event, obj) {
    let filteredCompanies: Company[] = [];
    let selectedTeamSize;
    if ($event.target.checked === true) {
      this.selectedTeamSize.push(obj.id);
      selectedTeamSize = this.selectedTeamSize;
      this.companies.forEach(function (company) {
        selectedTeamSize.forEach(function (teamSize) {
          if (company.teamSize.id == teamSize) {
            filteredCompanies.push(company)
          }

        });
      });
    } else {
      let index = this.selectedTeamSize.indexOf(obj.id);
      this.selectedTeamSize.splice(index, 1);
      selectedTeamSize = this.selectedTeamSize;
      this.companies.forEach(function (company) {
        selectedTeamSize.forEach(function (teamSize) {
          if (company.teamSize.id == teamSize) {
            filteredCompanies.push(company)
          }

        });
      });
    }
    this.filteredCompanies = filteredCompanies;
  }
}
