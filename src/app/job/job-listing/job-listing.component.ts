import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/company/job';
import { JobType } from '../../models/metadata/jobType';
import { Category } from '../../models/metadata/category';
import { OfferedSalaryRange } from '../../models/metadata/offeredSalaryRange';
import { CareerLevel } from '../../models/metadata/careerLevel';
import { ExperienceRange } from '../../models/metadata/experienceRange';
import { Industry } from '../../models/metadata/industry';
import { Qualification } from '../../models/metadata/qualification';
import { MetadataService } from '../../services/metadata.service';
import { CandidateService } from '../../services/candidate.service';
import { StorageService } from '../../common/storage/storage.service';
import { Candidate } from '../../models/candidate/candidate';
import { ToastrManager } from 'ng6-toastr-notifications';
import {ActivatedRoute} from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-job-listing',
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.css']
})
export class JobListingComponent implements OnInit {

  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  size = 10;
  page = 1;
  totalJob: number;
  jobType: JobType[];
  category: Category[];
  offererdSalary: OfferedSalaryRange[];
  careerLevel: CareerLevel[];
  experience: ExperienceRange[];
  industry: Industry[];
  qualification: Qualification;
  candidate: Candidate;

  selectedJobType: number[] = [];
  selectedSalary: number[] = [];
  selectedCareerLevel: number[] = [];
  selectedExperience: number[] = [];


  constructor(private jobService: JobService,
              private metadataService: MetadataService,
              private candidateService: CandidateService,
              private toast: ToastrManager,
              private storageService: StorageService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.checkHeader();
    // this.populateJob();

    this.populateMetadata();
    $('.sb-title.open').next().slideDown();
    $('.sb-title.closed').next().slideUp();
    $('.sb-title').on('click', function () {
      $(this).next().slideToggle();
      $(this).toggleClass('active');
    });

  }

  checkHeader() {
    //this.showLoader=true;
    this.route.params.subscribe(
      (params) => {
        // Defaults to 0 if no query param provided.
        let jobId = +params['id'] || 0;
        if (jobId != 0) {
          this.jobService.getJobByCategory(jobId).then((response => {
            this.jobs = response;
            this.getTotalJobCount(jobId);
            this.filteredJobs = this.jobs;
          }), (error => {
            console.log(error);
          }));
        }else
        {
          this.populateJob();
          this.getTotalJobCount(0);
        }
      }
    );
  }

  populateMetadata() {
    this.metadataService.getJobType().then((response => {
      this.jobType = response;
    }), (error => {

    }));
    this.metadataService.getCategory().then((response => {
      this.category = response;
    }), (error => {

    }));
    this.metadataService.getOfferedSalaryRange().then((response => {
      this.offererdSalary = response;
    }), (error => {

    }));
    this.metadataService.getCareerLevel().then((response => {
      this.careerLevel = response;
    }), (error => {

    }));
    this.metadataService.getExperienceRange().then((response => {
      this.experience = response;
    }), (error => {

    }));
    this.metadataService.getIndustry().then((response => {
      this.industry = response;
    }), (error => {

    }));
    this.metadataService.getQualification().then((response => {
      this.qualification = response;
    }), (error => {

    }));

  }

  allData() {
    this.filteredJobs = this.jobs;
  }
  populateJob() {
    this.candidate = this.storageService.getCandidate();
    this.jobService.getActiveJobs(this.page++, this.size).then(
      (response) => {
        if (this.jobs.length == 0) {
          this.jobs = response;
          this.filteredJobs = this.jobs;
          if (this.candidate.jobFavouriteSetId && this.jobs) {
            this.populateFavoriteJobs(this.candidate.jobFavouriteSetId);
          }
        } else {
          this.jobs = this.jobs.concat(response);
          if (this.candidate.jobFavouriteSetId && this.jobs) {
            this.populateFavoriteJobs(this.candidate.jobFavouriteSetId);
          }
        }
        this.jobs.sort(function (a, b) {
          return (a.candidateApplied === b.candidateApplied) ? 0 : a.candidateApplied ? -1 : 1;
        })
      }, (error) => {
        console.log(error);
      });
  }

  getTotalJobCount(category: number) {
    if(category != 0){
      this.jobService.getJobCountByCategory(category).then(
        (response => {
          this.totalJob = response;
        }), (error => {
          console.log(error);
        })
      );
    }else{
      this.jobService.getJobCount().then(
        (response => {
          this.totalJob = response;
        }), (error => {
          console.log(error);
        })
      );
    }
  }

  addToFavorite(job) {
    this.candidate = this.storageService.getCandidate();
    this.candidateService.favouriteJob(this.candidate.id, job).then(
      (response => {
        if (response) {
          this.candidate.jobFavouriteSetId = response;
          this.storageService.storeCandidate(this.candidate);
          this.populateFavoriteJobs(response);
          this.toast.successToastr('Job Added to Favourites', 'Successful !', { position: 'top-right' });
        }
      }), (error => {
        console.log(error);
      })
    );
  }

  removeFromFavorite(job) {
    this.candidate = this.storageService.getCandidate();
    this.candidateService.unfavouriteJob(this.candidate.id, job).then(
      (response => {
        if (response) {
          this.candidate.jobFavouriteSetId = response;
          this.storageService.storeCandidate(this.candidate);
          this.populateFavoriteJobs(response);
          this.toast.successToastr('Job Removed From Favourites', 'Successful !', { position: 'top-right' })
        }
      }), (error => {
        console.log(error);
      })
    );
  }

  populateFavoriteJobs(jobList: number[]) {
    let candidate = this.storageService.getCandidate();
    this.jobs.forEach(function (jb) {
      if (jobList.includes(jb.id)) {
        jb.favorite = true;
      } else {
        jb.favorite = false;
      }
      if (jb.candidateApplicationSetId.includes(candidate.id)) {
        jb.candidateApplied = true;
      }

    });
  }

  selectJobType($event, obj) {
    let filteredJob: Job[] = [];
    let selectedJobType;
    if ($event.target.checked === true) {
      this.selectedJobType.push(obj.id);
      selectedJobType = this.selectedJobType;
      this.jobs.forEach(function (job) {
        selectedJobType.forEach(function (jobType) {
          if (job.jobType.id == jobType) {
            filteredJob.push(job)
          }

        });
      });
    } else {
      let index = this.selectedJobType.indexOf(obj.id);
      this.selectedJobType.splice(index, 1);
      selectedJobType = this.selectedJobType;
      this.jobs.forEach(function (job) {
        selectedJobType.forEach(function (jobType) {
          if (job.jobType.id == jobType) {
            filteredJob.push(job)
          }

        });
      });
    }
    this.filteredJobs = filteredJob;
  }

  selectSalary($event, obj) {
    let filteredJob: Job[] = [];
    let selectedSalary;
    if ($event.target.checked === true) {
      this.selectedSalary.push(obj.id);
      selectedSalary = this.selectedSalary;
      this.jobs.forEach(function (job) {
        selectedSalary.forEach(function (offererdSalary) {
          if (job.offeredSalaryRange.id == offererdSalary) {
            filteredJob.push(job)
          }

        });
      });
    } else {
      let index = this.selectedSalary.indexOf(obj.id);
      this.selectedSalary.splice(index, 1);
      selectedSalary = this.selectedSalary;
      this.jobs.forEach(function (job) {
        selectedSalary.forEach(function (offererdSalary) {
          if (job.offeredSalaryRange.id == offererdSalary) {
            filteredJob.push(job)
          }

        });
      });
    }
    this.filteredJobs = filteredJob;
  }

  selectCareerLevel($event, obj) {
    let filteredJob: Job[] = [];
    let selectedCareerLevel;
    if ($event.target.checked === true) {
      this.selectedCareerLevel.push(obj.id);
      selectedCareerLevel = this.selectedCareerLevel;
      this.jobs.forEach(function (job) {
        selectedCareerLevel.forEach(function (careerLever) {
          if (job.careerLevel.id == careerLever) {
            filteredJob.push(job)
          }

        });
      });
    } else {
      let index = this.selectedCareerLevel.indexOf(obj.id);
      this.selectedCareerLevel.splice(index, 1);
      selectedCareerLevel = this.selectedCareerLevel;
      this.jobs.forEach(function (job) {
        selectedCareerLevel.forEach(function (careerLever) {
          if (job.careerLevel.id == careerLever) {
            filteredJob.push(job)
          }

        });
      });
    }
    this.filteredJobs = filteredJob;
  }

  selectExperience($event, obj) {
    let filteredJob: Job[] = [];
    let selectedExperience;
    if ($event.target.checked === true) {
      this.selectedExperience.push(obj.id);
      selectedExperience = this.selectedExperience;
      this.jobs.forEach(function (job) {
        selectedExperience.forEach(function (exp) {
          if (job.experienceRange.id == exp) {
            filteredJob.push(job)
          }

        });
      });
    } else {
      let index = this.selectedExperience.indexOf(obj.id);
      this.selectedExperience.splice(index, 1);
      selectedExperience = this.selectedExperience;
      this.jobs.forEach(function (job) {
        selectedExperience.forEach(function (exp) {
          if (job.experienceRange.id == exp) {
            filteredJob.push(job)
          }

        });
      });
    }
    this.filteredJobs = filteredJob;
  }
}
