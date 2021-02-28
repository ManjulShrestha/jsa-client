import {Country} from '../metadata/country';
import {City} from '../metadata/city';
import {Base} from '../common-models/baseEntity';

export class CandidateContactInfo extends Base {
  phoneNumber: string;
  email: string;
  website: string;
  country: Country;
  city: City;
  mapDetail: string;
  longitude: number;
  latitude: number;
}
