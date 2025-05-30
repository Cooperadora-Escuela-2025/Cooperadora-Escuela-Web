// import { HttpInterceptorFn } from '@angular/common/http';
// src/app/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { ProfileService } from './profile.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,private router: Router) {
     console.log('authInterceptor creado');
    }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const publicEndpoints = ['/login', '/register'];

    if (publicEndpoints.some(url => request.url.includes(url))) {
      return next.handle(request);
    }
    
  // para usuario
    const token = this.authService.getAccessToken();
    let authReq = request;
    if (token) {
      authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    // if (token) {
    //   const authReq = request.clone({
    //     setHeaders: {
    //       Authorization: `Bearer ${token}`
    //     }
    //   });
    //   return next.handle(authReq);
    // }
    // return next.handle(request);

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
        return this.authService.refreshToken().pipe(
        switchMap(() => {
          const newToken = this.authService.getAccessToken();
          const retryReq = request.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`
            }
          });
          return next.handle(retryReq);
        }),
        catchError(err => {
          this.authService.logout();
          this.router.navigate(['/login']);
          return throwError(() => err);
        })
      );
    }

    if (error.status === 403) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }

    return throwError(() => error);
  })
);

  }
}

 