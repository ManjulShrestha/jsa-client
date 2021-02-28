import {Base} from '../common-models/baseEntity';
import {Country} from '../metadata/country';
import {City} from '../metadata/city';

export class CompanyContactInfo extends Base {
  phoneNumber: String;
  email: String;
  website: String;
  mapDetail: String;
  longitude:  number;
  latitude: number;
  country: Country;
  city: City;

}

