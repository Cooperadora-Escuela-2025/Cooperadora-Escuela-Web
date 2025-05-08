import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.css',
})
export class CartSummaryComponent implements OnInit {
  cart: Product[] = []; // Lista de productos en el carrito
  total: number = 0; // Total del carrito

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Cargar el carrito desde el almacenamiento local
    const cartData = localStorage.getItem('cart');
    this.cart = cartData ? JSON.parse(cartData) : []; // Inicializar como array vacío si no hay datos
    this.calculateTotal();
  }

  // Calcular el total del carrito
  calculateTotal(): void {
    this.total = this.cart.reduce((sum, product) => sum + Number(product.price), 0);
  }

  // Eliminar un producto del carrito
  removeFromCart(product: Product): void {
    this.cart = this.cart.filter(p => p.id !== product.id);
    localStorage.setItem('cart', JSON.stringify(this.cart)); // Actualizar el almacenamiento local
    this.calculateTotal(); // Si estás en CartSummaryComponent
  }

  clearCart(): void {
    this.cart = [];
    localStorage.removeItem('cart'); // Vaciar el almacenamiento local
    this.calculateTotal(); // Si estás en CartSummaryComponent
  }

  // Navegar al checkout
  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}