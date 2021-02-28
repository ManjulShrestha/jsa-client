import {Base} from '../common-models/baseEntity';
import {MembershipType} from '../metadata/membershipType';
import {Company} from './company';
import {MerchantType} from '../metadata/merchantType';
import {Currency} from '../metadata/currency';

export class PaymentDetail extends Base {
  paymentDate:Date;
  merchantType:MerchantType ;
  currency:Currency;
  cardHolderName:String;
  token:String;
  paymentReceivedDate:Date;
  amount:number;
  description:String;
  refunded:boolean;
  status:String;
}

