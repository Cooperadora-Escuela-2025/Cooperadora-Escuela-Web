// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Product[] = [];
  private cartSubject = new BehaviorSubject<Product[]>([]);
  cart$ = this.cartSubject.asObservable();

  // Agrega un producto al carrito
  addToCart(product: Product): void {
    const existingProduct = this.cart.find(p => p.id === product.id);

    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }

    this.cartSubject.next([...this.cart]);
  }

  // Elimina un producto del carrito (una unidad o todo si solo hay una)
  removeFromCart(product: Product): void {
    this.cart = this.cart.reduce((acc: Product[], p) => {
      if (p.id === product.id) {
        if ((p.quantity || 1) > 1) {
          acc.push({ ...p, quantity: (p.quantity || 1) - 1 });
        }
        // Si es 1, no se agrega => se elimina del carrito
      } else {
        acc.push(p);
      }
      return acc;
    }, []);

    this.cartSubject.next([...this.cart]);
  }

  // Vacía el carrito completamente
  clearCart(): void {
    this.cart = [];
    this.cartSubject.next([]);
  }
}
