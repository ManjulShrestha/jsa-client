import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MetadataService} from '../../services/metadata.service';
import {ModalManager} from 'ngb-modal';
import {ToastrManager} from 'ng6-toastr-notifications';
import {Candidate} from '../../models/candidate/candidate';
import {CandidateService} from '../../services/candidate.service';
import {PopupService} from '../../services/popup.service';
import {FileUploadService} from '../../services/file-upload.service';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css']
})
export class CandidatesComponent implements OnInit {

  candidateForm: FormGroup;
  candidate: Candidate;
  objectType: string;
  action: string;
  showLoader = false;
  showString: string;
  @ViewChild('candidateModal') candidateModal;
  size = 10;
  page = 0;
  candidates: Candidate[] = [];
  totalCandidate: number;
  private modalRef;

  constructor(
    private metadataService: MetadataService,
    private candidateService: CandidateService,
    public modalService: ModalManager,
    public toastr: ToastrManager,
    private popupService: PopupService,
    private fileUploadService: FileUploadService
  ) {
  }

  ngOnInit() {
    this.populateCandidateList();
    this.getTotalCandidate();
    this.initializeForm();
  }

  initializeForm() {
    this.candidateForm = new FormGroup({
      'nameEnglish': new FormControl(null, Validators.required)
    });
  }

  populateCandidateList() {
    this.showLoader = true;
    this.candidateService.getCandidateList(this.page++, this.size).then(
      (response) => {
        if (this.candidates.length == 0) {
          this.candidates = response;
        } else {
          this.candidates = this.candidates.concat(response);
        }
        this.showLoader = false;
        this.fetchCandidatePhotos(this.candidates);

      }, (error) => {
        console.log(error);
      });
  }

  getTotalCandidate() {
    this.candidateService.getCandidatesCount().then(
      (response => {
        this.totalCandidate = response;
      }), (error => {
        console.log(error);
      })
    );
  }

  addCandidate(popupName) {
    this.openPopup(new Candidate(), popupName, 'candidate', 'add');
  }

  saveCandidate(actionType) {
    this.showLoader = true;
    if (actionType == 'delete') {
      this.showString = 'deleted';
      this.candidate.deleted = true;
    } else {
      this.showString = 'updated';
    }
    if (this.candidate.id != null) {
      this.candidateService.updateCandidate(this.candidate).then((response) => {
        this.candidate = response;
        this.closeModal();
        this.populateCandidateList();
        this.showLoader = false;
        this.toastr.successToastr('Candidate sucessfully ' + this.showString + '!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------1----', error);
      };
    } else {
      this.candidateService.addCandidate(this.candidate).then((response) => {
        this.candidate = response;
        this.closeModal();
        this.populateCandidateList();
        this.showLoader = false;
        this.toastr.successToastr('Candidate sucessfully added!!!', 'Success!', {
          position: 'top-right'
        });
      }), (error) => {
        this.toastr.errorToastr('Some error Occurred.' + error, 'Oops!');
        console.log('-------------ERROR-----------2----', error);
      };
    }
  }

  openPopup(object, popupForm, objectType, action) {
    this.candidate = object;
    this.objectType = 'candidate';
    this.setAction(action);
    this.modalRef = this.popupService.openPopup(popupForm);
  }

  setAction(action) {
    if (action == 'add') {
      this.action = 'add';
    } else if (action == 'edit') {
      this.action = 'edit';
    }
  }

  closeModal() {
    this.modalService.close(this.modalRef);
  }
  fetchCandidatePhotos(candidate: Candidate[]){
    let fileUploadService= this.fileUploadService;
    candidate.forEach(function (candidate) {
      candidate.isImageLoading = true;
      if (candidate.picturePath != null){
        fileUploadService.viewFile('thumb_'+candidate.picturePath).then((response) => {
          let reader = new FileReader();
          if (response) {
            reader.readAsDataURL(response);
            reader.onload = (event) => {
              console.log(event);
              candidate.companyProfilePic = reader.result;
            }
          }
          candidate.isImageLoading = false;
        }, (error) => {
          candidate.isImageLoading = true;
          console.log(error);
        });
      }
    })
  }
}
