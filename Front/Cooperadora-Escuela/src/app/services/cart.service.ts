import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private url = 'http://localhost:8000/';

  constructor(private http: HttpClient) {}

  private cart: Product[] = [];
  private cartSubject = new BehaviorSubject<Product[]>([]);
  cart$ = this.cartSubject.asObservable();


  addToCart(product: Product): void {
    const existingProduct = this.cart.find(p => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.cartSubject.next([...this.cart]);
  }

  removeFromCart(product: Product): void {
    this.cart = this.cart.reduce((acc: Product[], p) => {
      if (p.id === product.id) {
        if ((p.quantity || 1) > 1) {
          acc.push({ ...p, quantity: (p.quantity || 1) - 1 });
        }
      } else {
        acc.push(p);
      }
      return acc;
    }, []);
    this.cartSubject.next([...this.cart]);
  }

  clearCart(): void {
    this.cart = [];
    this.cartSubject.next([]);
  }

  getCart(): Product[] {
    return [...this.cart];
  }

  reservarProductos(reserva: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.url+'reservas/', reserva, { headers });
  }

  getReservasUsuario() {
  // Ajustá la URL a tu endpoint backend para traer reservas del usuario autenticado
  return this.http.get<any[]>(this.url+'reservas/');
}
}