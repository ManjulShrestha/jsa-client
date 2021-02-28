import {User} from '../identity/user';
import {CandidateSocialInfo} from './candidateSocialInfo';
import {CandidateContactInfo} from './candidateContactInfo';
import {Currency} from '../metadata/currency';
import {ExperienceRange} from '../metadata/experienceRange';
import {AgeRange} from '../metadata/ageRange';
import {EducationType} from '../metadata/educationType';
import {Language} from '../metadata/language';
import {Category} from '../metadata/category';
import {Base} from '../common-models/baseEntity';
import {JobTitle} from '../metadata/jobTitle';
import {CandidateResume} from './candidate-resume';
import {Gender} from '../metadata/gender';


export class Candidate extends Base {
  name: string;
  jobTitle: JobTitle;
  allowInSearch: boolean;
  minimumSalary: number;
  currency: Currency;
  experienceRange: ExperienceRange;
  ageRange: AgeRange;
  educationType: EducationType;
  language: Language;
  gender: Gender;
  currentSalaryMinimum: number;
  currentSalaryMaximum: number;
  expectedSalaryMinimum: number;
  expectedSalaryMaximum: number;
  candidateSocialInfo: CandidateSocialInfo = new CandidateSocialInfo();
  candidateContactInfo: CandidateContactInfo = new CandidateContactInfo();
  candidateResume: CandidateResume = new CandidateResume();
  categorySet: Category[];
  description: String;
  picturePath: String;
  user: User;
  jobFavouriteSetId: [];
  companyProfilePic: any;
  isImageLoading:boolean;
  following:boolean;
}

