import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../models/auth.model';



@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'http://localhost:8000/'; 
  
  constructor(private http: HttpClient) {}


 //obtiene el token almacenado
 getAccessToken(): string | null {
   return localStorage.getItem('access_token');
 }
 getProfile(): Observable<any> {
   return this.http.get<any>(`${this.baseUrl}profile/`);
 }
 
 updateProfile(profileData: any): Observable<any> {
   return this.http.put<any>(`${this.baseUrl}profile/`, profileData);
 }

// enpoind para el admin

// traer todos los perfiles 
getAllProfiles(): Observable<any[]> {
  const token = this.getAccessToken();  // Asegúrate de que el token esté disponible
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any[]>(`${this.baseUrl}all-users/`, { headers });
}

// traer perfil por id
getProfileById(id: number): Observable<any> {
  const token = this.getAccessToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`${this.baseUrl}all-users/${id}/`, { headers });
}

// actualiza perfil por id
updateProfileById(id: number, data: any): Observable<any> {
  const token = this.getAccessToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  // Usa la URL correcta que incluye el id
  return this.http.put<any>(`${this.baseUrl}all-users/${id}/`, data, { headers });
}

// elimina perfil por id
deleteProfile(id: number): Observable<any> {
  const token = this.getAccessToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete<any>(`${this.baseUrl}all-users/${id}/`, { headers });
}

// crea un nuevo usuario
createUserByAdmin(userData: any, token: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    });

    return this.http.post(`${this.baseUrl}create-user/`, userData, { headers });
  }

  // historial de compra 
  getPurchaseHistory() {
    return this.http.get<any[]>(this.baseUrl+'history/');
  }
}