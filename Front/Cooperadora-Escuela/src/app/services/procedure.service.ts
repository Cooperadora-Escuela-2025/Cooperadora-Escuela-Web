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

  
  getProcedures(): Observable<Procedure[]> {
    return this.http.get<Procedure[]>(this.url+'procedure/');
  }

 
  createProcedure(procedure: Procedure): Observable<Procedure> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    });
    return this.http.post<Procedure>(this.url+'procedure/', procedure, { headers });
  }

   getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }


   descargarComprobante(cuotaId: number) {
    const token = this.getAccessToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.url}cuota/${cuotaId}/comprobante/`;

  return this.http.get(url, { headers, responseType: 'blob' });
  }

  crearCuota(data: any) {
    return this.http.post(this.url+'cuotas/', data);
  }

  obtenerQrPago(cuotaId: number): Observable<Blob> {
  return this.http.get(`${this.url}/cuotas/${cuotaId}/qr/`, {
    responseType: 'blob'
  }); 
}

subirComprobante(data: FormData): Observable<any> {
    const token = this.getAccessToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.url}/enviar-comprobante/`, data, { headers });
  }
}
