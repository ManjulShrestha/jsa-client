import {Component, OnInit} from '@angular/core';
import {Company} from '../../models/company/company';
import {StorageService} from '../../common/storage/storage.service';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.css']
})

export class TransactionDetailComponent implements OnInit {

  company: Company;

  constructor(private storageService: StorageService) {
  }

  ngOnInit() {
    this.populateTransactionDetail();
  }

  populateTransactionDetail() {
    this.company = this.storageService.getCompany();
    console.log(this.company);
  }

}
