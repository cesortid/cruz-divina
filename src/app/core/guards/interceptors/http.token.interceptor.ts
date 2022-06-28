import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import {Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor( private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const headersConfig = {
    //   'Content-Type': 'application/json',
    //   'Accept': 'application/json',
    //   'Authorization':null
    // };

    const token = sessionStorage.getItem('token');
    let request = req;

    if (token) {
      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }else{
      //enviar a una pagina de inicio
    }


    // return next.handle(request).pipe(
    //  // catchError(this.manejarError)
    // );
    return next.handle(request).pipe(
      catchError(error => {
        let errorMessage = '';
        if (error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Client-side error: ${error.error.message}`;
        } else {
          // backend error
          errorMessage = `Server-side error: ${error.status} ${error.message}`;
        }
        
        // aquí podrías agregar código que muestre el error en alguna parte fija de la pantalla.

        if (error.status === 401) {
          this.router.navigate(['login']) .then(() => {
            window.location.reload();
          });
        }

        return throwError(errorMessage);
      })
    );
  }
  manejarError(error:HttpErrorResponse){
    if (error.status === 401) {
      this.router.navigate(['login']);
    }
    //return throwError('Error Personalizado');
  }
}
