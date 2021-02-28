import {Base} from '../common-models/baseEntity';
import {CandidateResume} from './candidate-resume';

export class CandidateProfessionalSkills extends Base {
  skillHeading: string;
  percentage: number;
  uuId: string;
  candidateResume: CandidateResume;
}
