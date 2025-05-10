import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Procedure } from '../models/procedure.model';

@Injectable({
  providedIn: 'root'
})
export class ProcedureService {

  private url =  'http://localhost:8000/'; 

  constructor(private http: HttpClient) { }

  // Obtener todos los trámites de un usuario
  getProcedures(): Observable<Procedure[]> {
    return this.http.get<Procedure[]>(this.url+'procedure/');
  }

  // Crear un nuevo trámite
  createProcedure(procedure: Procedure): Observable<Procedure> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    });
    return this.http.post<Procedure>(this.url+'procedure/', procedure, { headers });
  }

   getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
