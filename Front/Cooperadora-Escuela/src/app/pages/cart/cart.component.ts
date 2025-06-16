import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule, formatDate } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

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
    private router: Router 
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
    this.router.navigate(['/checkout']);
  }

  goToProducts(): void {
  this.router.navigate(['/products']);
  }

  reservarProductos() {
    const fecha = prompt(
      "¿Para qué fecha querés reservar? (formato DD-MM-AAAA)",
      formatDate(new Date(), 'dd-MM-yyyy', 'en')
    );
    if (!fecha) return;

    const partes = fecha.split('-');
    if (partes.length !== 3) {
      alert('Formato incorrecto. Debe ser DD-MM-AAAA');
      return;
    }

    const fechaIso = `${partes[2]}-${partes[1]}-${partes[0]}`;

    const notas = prompt("¿Querés dejar alguna nota para la reserva?") || '';

    const items = this.cart.map(product => ({
      product: product.id,
      quantity: product.quantity
    }));

    const reserva = {
      reserved_for_date: fechaIso,
      notes: notas,
      items: items
    };

    this.cartService.reservarProductos(reserva).subscribe({
      next: res => {
        alert('✅ ¡Reserva creada con éxito! Para ver más información sobre tu reserva, por favor visita tu perfil.');
        this.clearCart();
      },
      error: err => {
        console.error('❌ Error al crear la reserva:', err);
        alert('Hubo un problema al hacer la reserva.');
      }
    });
}
}
