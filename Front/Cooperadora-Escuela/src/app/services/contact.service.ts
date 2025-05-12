import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  private apiUrl = 'http://localhost:8000/contacto/';

  constructor(private http: HttpClient) {}

  enviarMensaje(datos: any): Observable<any> {
    return this.http.post(this.apiUrl, datos);
  }
}
