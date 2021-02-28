import { Injectable } from '@angular/core';
import {HttpService} from './http/http.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpService) { }

  uploadFile(fileName:String,formdata:FormData) {
    return this.http.post('file/upload?fileName='+fileName, formdata);
  }

  deleteFile(fileName:String){
    return this.http.put('file/delete-document?fileName=', fileName);
  }

  viewFile(fileName:String){
    return this.http.get("file/get-uploaded-file?fileName="+fileName,{ responseType: 'blob' as 'json' });
  }
}
