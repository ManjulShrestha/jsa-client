import {Base} from '../common-models/baseEntity';
import {CandidateResume} from './candidate-resume';

export class CandidateWorkExperience extends Base {
  title: string;
  description: string;
  company: string;
  startDate: Date;
  endDate: Date;
  present: boolean;
  uuId: string;
  candidateResume: CandidateResume;
}
