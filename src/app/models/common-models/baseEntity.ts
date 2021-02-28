export class Base {

  id: number;
  deleted: Boolean = false;
  deletedBy: number;
  deletedOn: Date;
  addedBy: number;
  addedDate: Date;
  modifiedBy: number;
  modifiedDate: Date;
  versionId: number = 0;


  constructor() {
  }
}
