import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject } from "@angular/core";
@Injectable()
export class HttpService{

	constructor(private http: HttpClient,
		@Inject('@@environment') private environment
	){

	}
	get<T>(url: string, options?: { headers?: HttpHeaders;
		observe?: 'body';
		params?: HttpParams;
		reportProgress?: boolean;
		responseType?: 'json';
		withCredentials?: boolean;
	}): Promise<any> {
		return this.http.get<T>(this.environment.api + url, options).toPromise();
	}
	
	post(url: string, body: any | null, options?: { headers?: HttpHeaders;
		observe?: 'body';
		params?: HttpParams;
		reportProgress?: boolean;
		responseType?: 'json';
		withCredentials?: boolean;
	}): Promise<any> {
		return this.http.post(this.environment.api + url, body, options).toPromise();  }

	put(url: string, body: any | null, options?: { Headers?: HttpHeaders;
		observe?: 'body';
		params?: HttpParams;
		reportProgress?: boolean;
		responseType?: 'json';
		withCredentials?: boolean;
	}): Promise<any>
		{
			return this.http.put(this.environment.api + url, body, options).toPromise();  }

	delete(url: string, options?: { headers?: HttpHeaders;
		observe?: 'body';
		params?: HttpParams;
		reportProgress?: boolean;
		responseType?: 'json';
		withCredentials?: boolean;
	}): Promise<any>
		{ return this.http.delete(this.environment.api + url, options).toPromise();  }
}
