import {EventEmitter, Injectable} from '@angular/core';
import {HttpService} from './http/http.service';
import {User} from '../models/identity/user';

@Injectable()
export class MetadataService {

  constructor(private http: HttpService) {
  }

  getUserTypes() {
    return this.http.get('metadata/user-types');
  }

  getAgeRange(){
    return this.http.get('metadata/age-range');
  }

  addAgeRange(ageRange) {
    return this.http.post('metadata/age-range', ageRange);
  }

  updateAgeRange(ageRange) {
    return this.http.put('metadata/age-range', ageRange);
  }

  getCareerLevel(){
    return this.http.get('metadata/career-level');
  }

  addCareerLevel(careerLevel) {
    return this.http.post('metadata/career-level', careerLevel);
  }

  updateCareerLevel(careerLevel) {
    return this.http.put('metadata/career-level', careerLevel);
  }

  getCategory(){
    return this.http.get('metadata/category');
  }
  
  addCatagory(category){
    return this.http.post('metadata/category',category);
  }

  updateCategory(category) {
    return this.http.put('metadata/category', category);
  }

  getCity(){
    return this.http.get('metadata/cities');
  }

  addCity(city) {
    return this.http.post('metadata/city', city);
  }

  updateCity(city) {
    return this.http.put('metadata/city', city);
  }

  getCountry(){
    return this.http.get('metadata/countries');
  }

  addCountry(country) {
    return this.http.post('metadata/city', country);
  }

  updateCountry(country) {
    return this.http.put('metadata/city', country);
  }

  getCurrency(){
    return this.http.get('metadata/currency');
  }

  addCurrency(currency) {
    return this.http.post('metadata/currency', currency);
  }

  updateCurrency(currency) {
    return this.http.put('metadata/currency', currency);
  }

  getEducationType(){
    return this.http.get('metadata/education-type');
  }

  addEducationType(educationType) {
    return this.http.post('metadata/education-type', educationType);
  }

  updateEducationType(educationType) {
    return this.http.put('metadata/education-type', educationType);
  }

  getExperienceRange(){
    return this.http.get('metadata/experience-range');
  }

  addExperienceRange(experienceRange) {
    return this.http.post('metadata/experience-range', experienceRange);
  }

  updateExperienceRange(experienceRange) {
    return this.http.put('metadata/experience-range', experienceRange);
  }
  getGender(){
    return this.http.get('metadata/gender');
  }

  getIndustry(){
    return this.http.get('metadata/industry');
  }

  addIndustry(industry) {
    return this.http.post('metadata/industry', industry);
  }

  updateIndustry(industry) {
    return this.http.put('metadata/industry', industry);
  }


  getJobTitle(){
    return this.http.get('metadata/job-title');
  }

  addJobTitle(jobTitle) {
    return this.http.post('metadata/job-title', jobTitle);
  }

  updateJobTitle(jobTitle) {
    return this.http.put('metadata/job-title', jobTitle);
  }

  getJobType(){
    return this.http.get('metadata/job-type');
  }

  getLanguage(){
    return this.http.get('metadata/language');
  }

  addLanguage(language) {
    return this.http.post('metadata/language', language);
  }

  updateLanguage(language) {
    return this.http.put('metadata/language', language);
  }

  getMembershipType(){
    return this.http.get('metadata/membership-type');
  }

  getMerchantType(){
    return this.http.get('metadata/merchant-type');
  }

  getOfferedSalaryRange(){
    return this.http.get('metadata/offered-salary-range');
  }

  getQualification(){
    return this.http.get('metadata/qualification');
  }

  getSkill(){
    return this.http.get('metadata/skill');
  }

  addSkill(skill){
    return this.http.post('metadata/skill',skill);
  }

  getTeamSize(){
    return this.http.get('metadata/team-size');
  }
}
