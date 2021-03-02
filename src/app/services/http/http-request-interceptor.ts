import {Injectable, Inject} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {StorageService} from '../../common/storage/storage.service';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/internal/operators';


@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor(private router: Router, private storageService: StorageService, @Inject('@@environment') private environment) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const user = this.storageService.getCurrentUser();
    const userId = this.storageService.getCurrentUser() ? this.storageService.getCurrentUser()['id'].toString() : '-1';
    if (userId != -1) {
      request = request.clone({
        setHeaders: {
          'Authorization': 'Bearer ' + user.token
        }
      });
    }
    //console.log(request)
    return next.handle(request)
    // return next.handle(request).do(
    //   (event: HttpEvent<any>) => {
    //     if (event instanceof HttpResponse) {
    //
    //     }
    //   },
    //   (error: any) => {
    //     if (error instanceof HttpErrorResponse) {
    //       if (error.status === 401) {
    //         this.router.navigate(['login']);
    //       }
    //     }
    //   }
    // );

    // return next.handle(request).pipe(tap(
    //   (err: any) => {
    //     if (err instanceof HttpErrorResponse) {
    //       console.log(err);
    //       console.log('req url :: ' + request.url);
    //       if (err.status === 401) {
    //                 this.router.navigate(['login']);
    //
    //       }
    //     }
    //   }
    // ));
  }


}

