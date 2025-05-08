// import { HttpInterceptorFn } from '@angular/common/http';
// src/app/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ProfileService } from './profile.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
     console.log('authInterceptor creado');}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const publicEndpoints = ['/login', '/register'];
  //   console.log('Interceptando request a:', request.url);
  // console.log('Token en interceptor:', this.authService.getAccessToken());
  // console.log('Token en interceptor:', this.profileService.getAccessToken());
    // Si la URL incluye alguno de los endpoints públicos, no agregar el token
    if (publicEndpoints.some(url => request.url.includes(url))) {
      return next.handle(request);
    }
    
  // para usuario
    const token = this.authService.getAccessToken();
    if (token) {
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }
    return next.handle(request);

  }
}

 