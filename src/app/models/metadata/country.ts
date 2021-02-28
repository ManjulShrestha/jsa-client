import {Base} from '../common-models/baseEntity';

export class Country extends Base {
  nameEnglish: string;
  isoA2: string;
  isoA3: string;
  isoN3: string;
  nasciiCode: number;
  sortOrder: number;
}

