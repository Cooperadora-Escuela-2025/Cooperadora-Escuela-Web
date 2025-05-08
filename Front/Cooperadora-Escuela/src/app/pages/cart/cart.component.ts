import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cart: Product[] = [];

  constructor(
    private cartService: CartService,
    private http: HttpClient // Inyección de HttpClient para llamadas HTTP
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
  checkout(): void {
    const url = 'http://localhost:8000/api/registrar-compra/'; // Ajustá a tu URL real

    this.http.post(url, this.cart).subscribe({
      next: (response) => {
        console.log('Compra enviada:', response);
        alert('Gracias por tu compra. ¡Tu pedido fue enviado al servidor!');
        this.clearCart();
      },
      error: (error) => {
        console.error('Error al registrar la compra:', error);
        alert('Ocurrió un error al enviar la compra.');
      }
    });
  }
}
