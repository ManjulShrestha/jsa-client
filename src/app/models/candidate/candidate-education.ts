import {Base} from '../common-models/baseEntity';
import {EducationType} from '../metadata/educationType';
import {CandidateResume} from './candidate-resume';

export class CandidateEducation extends Base {
  title: string;
  institute: string;
  description: string;
  startDate: Date;
  endDate: Date;
  uuId: string;
  educationType: EducationType;
  selectedEducationType: any;
  candidateResume: CandidateResume;
}
