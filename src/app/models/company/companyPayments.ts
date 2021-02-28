import {Base} from '../common-models/baseEntity';
import {MembershipType} from '../metadata/membershipType';
import {Company} from './company';
import {PaymentDetail} from './paymentDetail';

export class CompanyPayments extends Base {
  startDate:Date;
  endDate:Date;
  noOfJobSlots:number;
  noOfJobPosted:number;
  paymentAmount:number;
  membershipType:MembershipType;
  paymentDetail:PaymentDetail;
  company:Company;
}

