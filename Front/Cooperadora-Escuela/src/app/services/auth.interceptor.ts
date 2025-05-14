// import { HttpInterceptorFn } from '@angular/common/http';
// src/app/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { ProfileService } from './profile.service';
import { Router } from '@angular/router';


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
        if (error.status === 401 || error.status === 403) {
          // Token expirado o inválido
          this.authService.logout(); // limpia el local storage
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}

 