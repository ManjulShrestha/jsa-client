import {Base} from '../common-models/baseEntity';
import {User} from '../identity/user';
import {CompanySocialInfo} from './companySocialInfo';
import {CompanyContactInfo} from './companyContactInfo';
import {Category} from '../metadata/category';
import {TeamSize} from '../metadata/teamSize';
import {Industry} from '../metadata/industry';
import {Job} from './job';
import {Candidate} from '../candidate/candidate';
import {CompanyPayments} from './companyPayments';
import {CompanyPictures} from './companyPictures';

export class Company extends Base {
  name: String;
  startDate: Date;
  description: String;
  picturePath: String;
  teamSize:  TeamSize;
  user: User;
  industry: Industry;
  companySocialInfo: CompanySocialInfo= new CompanySocialInfo();
  companyContactInfo: CompanyContactInfo= new CompanyContactInfo();
  categorySet: Category[];
  jobSet: Job[];
  candidateFollowSet: Candidate[];
  candidateViewSet: Candidate[];
  followers:number;
  viewers:number;
  companyProfilePic: any;
  isImageLoading:boolean;
  jobCount:number;
  companyPayments:CompanyPayments[];
  candidateFollowSetId:any;
  candidateViewSetId:any;
  following:boolean;
  latestPayment:CompanyPayments;
  companyPictures: CompanyPictures[];
}

