import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { User } from '../models/auth.model';



@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private baseUrl = 'http://localhost:8000/'; 
  // para que los datos del localstorage se actualizen
  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register/`, data);
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(this.baseUrl+"login/", credentials)
      .pipe(
        tap(response => {
          //setUser para emitir el usuario logueado
          this.setUser(response.user); 
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh', response.refresh);
        })
      );
  }

   // Obtiene el token almacenado
   getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  
  logout(): void {

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');//para cerrar sesion
    // localStorage.removeItem('user_email');
    // localStorage.removeItem('user_id');
    localStorage.removeItem('user');
    localStorage.removeItem('is_staff');
    // localStorage.removeItem('cart');
    this.currentUserSubject.next(null);
    window.location.href = '/login';
  }

  setUser(user: any): void {
    
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getUser(id: number): Observable<User> {
  return this.http.get<User>(`${this.baseUrl+"user/"}${id}/`);
}

getUs(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}user/`);
}


getUserFromStorage(): any | null {
    const user = localStorage.getItem('user');
    try {
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  }

// para saber cuando entra el admin
isAdmin(): boolean {
  const user = this.getUserFromStorage();
  return user?.is_staff === true;
}

// renovar el token
refreshToken(): Observable<any> {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) {
    return throwError(() => new Error('No refresh token'));
  }

  return this.http.post<any>(this.baseUrl + 'token/refresh/', { refresh }).pipe(
    tap(response => {
      localStorage.setItem('access_token', response.access);
    })
  );
}

}