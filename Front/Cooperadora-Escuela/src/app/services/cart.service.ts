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
}
