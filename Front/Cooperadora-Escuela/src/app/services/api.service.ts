import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Importa HttpClient
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private baseUrl = 'http://localhost:8000'; // URL de tu backend Django
  private urlToken='http://localhost:8000/api/token/';

  constructor(private http: HttpClient) { } // Inyecta HttpClient aquí

  getProducts(): Observable<any> {
    const token = localStorage.getItem('access_token');//autoriza al user
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get(`${this.baseUrl}/products/`, { headers });
  }

  // login(username: string, password: string): Observable<any> {
  //   const body = { username, password }; // Datos en formato JSON
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json' // Indica que el contenido es JSON
  //   });

  //   return this.http.post(`${this.baseUrl}/login/`, body, { headers });
  // }

  createOrder(order: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/checkout/`, order); // Enviar la orden al backend
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/${id}/`);
  }

createPreference(order: any) {
  return this.http.post<any>(`${this.baseUrl}/create_preference/`, order);
}

}
