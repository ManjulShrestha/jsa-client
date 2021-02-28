import {Base} from '../common-models/baseEntity';
import {CandidateEducation} from './candidate-education';
import {CandidateAwards} from './candidate-awards';
import {CandidatePortFolio} from './candidate-port-folio';
import {CandidateProfessionalSkills} from './candidate-professional-skills';
import {CandidateWorkExperience} from './candidate-work-experience';

export class CandidateResume extends Base {
  candidateEducations: CandidateEducation[];
  candidateAwards: CandidateAwards[];
  candidatePortFolios: CandidatePortFolio[];
  candidateProfessionalSkills: CandidateProfessionalSkills[];
  candidateWorkExperiences: CandidateWorkExperience[];
  pdfPath: string;
}
