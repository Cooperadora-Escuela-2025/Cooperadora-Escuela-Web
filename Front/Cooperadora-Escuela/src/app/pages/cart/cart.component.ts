import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Product[] = [];

  constructor(
    private cartService: CartService,
    private http: HttpClient, // Inyección de HttpClient para llamadas HTTP
    private router: Router // Asegúrate de inyectar Router aquí
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del carrito
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
    });
  }

  // Método para eliminar un producto del carrito
  removeFromCart(product: Product): void {
    this.cartService.removeFromCart(product);
  }

  // Método para vaciar el carrito
  clearCart(): void {
    this.cartService.clearCart();
  }

  // Método para calcular el total del carrito
  getTotal(): number {
    return this.cart.reduce((total, product) => {
      return total + product.price * (product.quantity || 1);
    }, 0);
  }

  // Método para finalizar la compra
  goToCheckout(): void {
    this.router.navigate(['/checkout']); // Aquí ya funciona el router
  }
}

