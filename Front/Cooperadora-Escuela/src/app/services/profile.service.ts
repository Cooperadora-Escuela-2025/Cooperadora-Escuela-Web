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

}