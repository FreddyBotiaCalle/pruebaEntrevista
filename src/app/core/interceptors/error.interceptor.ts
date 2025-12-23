import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocurrió un error desconocido';

        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          errorMessage = `Código: ${error.status} - ${error.message}`;
        }

        console.error('HTTP Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
