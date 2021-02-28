import { Injectable } from '@angular/core';
import {HttpService} from './http/http.service';
import {CandidateResume} from '../models/candidate/candidate-resume';
import {CandidateAwards} from '../models/candidate/candidate-awards';
import {CandidateEducation} from '../models/candidate/candidate-education';
import {CandidatePortFolio} from '../models/candidate/candidate-port-folio';
import {CandidateProfessionalSkills} from '../models/candidate/candidate-professional-skills';
import {CandidateWorkExperience} from '../models/candidate/candidate-work-experience';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  constructor(private http: HttpService) {
  }

  getResumeById(id: number) {
    return this.http.get('candidate/resume/' + id);
  }

  getResumeByCandidateId(id: number) {
    return this.http.get('candidate/resume/candidate-id/' + id);
  }

  addCandidateResume(resume: CandidateResume, candidateId: number) {
    return this.http.post('candidate/resume/' + candidateId, resume);
  }

  updateCandidateResume(resume: CandidateResume, candidateId: number) {
    return this.http.put('candidate/resume/' + candidateId, resume);
  }

  addCandidateAwards(awards: CandidateAwards) {
    return this.http.post('candidate/awards', awards);
  }

  updateCandidateAwards(awards: CandidateAwards) {
    return this.http.put('candidate/awards', awards);
  }

  addCandidateEducation(education: CandidateEducation) {
    return this.http.post('candidate/education', education);
  }

  updateCandidateEducation(education: CandidateEducation) {
    return this.http.put('candidate/education', education);
  }

  addCandidatePortFolio(portFolio: CandidatePortFolio) {
    return this.http.post('candidate/portfolio', portFolio);
  }

  updateCandidatePortFolio(portFolio: CandidatePortFolio) {
    return this.http.put('candidate/portfolio', portFolio);
  }

  addCandidateProfessionalSkills(professionalSkills: CandidateProfessionalSkills) {
    return this.http.post('candidate/professional-skills', professionalSkills);
  }

  updateCandidateProfessionalSkills(professionalSkills: CandidateProfessionalSkills) {
    return this.http.put('candidate/professional-skills', professionalSkills);
  }

  addCandidateWorkExperience(workExperience: CandidateWorkExperience, resumeId) {
    return this.http.post('candidate/work-experience/' + resumeId, workExperience);
  }

  updateCandidateWorkExperience(workExperience: CandidateWorkExperience, resumeId) {
    return this.http.put('candidate/work-experience/' + resumeId, workExperience);
  }
}
