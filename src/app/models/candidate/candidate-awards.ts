import {Base} from '../common-models/baseEntity';
import {CandidateResume} from './candidate-resume';

export class CandidateAwards extends Base {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  uuId: string;
  candidateResume: CandidateResume;
}
