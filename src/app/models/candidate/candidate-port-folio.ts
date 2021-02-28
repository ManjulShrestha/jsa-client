import {Base} from '../common-models/baseEntity';
import {CandidateResume} from './candidate-resume';

export class CandidatePortFolio extends Base {
  title: string;
  picturePath: string;
  candidateResume: CandidateResume;
  uuId: string;
}
