import {ModalManager} from 'ngb-modal';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class PopupService {
  private modalRef;

  constructor(
    public modalService: ModalManager,
  ) {
  }

  openPopup(popupName) {
    this.modalRef = this.modalService.open(popupName, {
      size: 'md',
      modalClass: 'mymodal',
      hideCloseButton: false,
      centered: false,
      backdrop: true,
      animation: true,
      keyboard: false,
      closeOnOutsideClick: false,
      backdropClass: 'modal-backdrop'
    });
    return this.modalRef;
  }

  closePopup() {
    this.modalService.close(this.modalRef);
  }
}
