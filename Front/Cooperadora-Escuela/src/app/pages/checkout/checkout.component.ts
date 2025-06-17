import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart: Product[] = [];
  total: number = 0;
  name: string = '';
  surname: string = '';
  dni: string = '';
  paymentMethod: string = 'efectivo';

  constructor(
    private cartService: CartService,
    private apiService: ApiService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    this.total = this.calculateTotal();
  }

  calculateTotal(): number {
    return this.cart.reduce(
      (sum, product) => sum + product.price * (product.quantity || 1),
      0
    );
  }

submitOrder(): void {
  const order = {
    name: this.name,
    surname: this.surname,
    dni: this.dni,
    total: this.total,
    payment_method: this.paymentMethod,
    products: this.cart.map(product => ({
      product: product.id,
      unit_price: product.price,
      quantity: product.quantity || 1,
    })),
  };

  console.log('Datos enviados al backend:', order);

  this.apiService.createOrder(order).subscribe({
    next: (response) => {
      if (this.paymentMethod === 'mercadopago') {
        if (response && response.payment_url) {
          window.location.href = response.payment_url; // Redirige a MercadoPago
        } else {
          alert('Error al generar la preferencia de pago');
        }
      } else {
        alert(`Compra con ${this.paymentMethod} exitosa.`);
        this.cartService.clearCart();
        this.router.navigate(['/products']);
      }
    },
    error: (error) => {
    console.error('Error al crear la orden:', error);

    if (error.error) {
      if (typeof error.error === 'string') {
        alert(error.error);
      } else if (error.error.products) {
        alert(error.error.products.join('\n'));
      } else if (error.error.detail) {
        alert(error.error.detail);
      } else {
        alert('Hubo un error al procesar la orden.');
      }
    } else {
      alert('Hubo un error al procesar la orden.');
    }
  }
});
}


  goToProductList(): void {
    this.router.navigate(['/products']);
  }

  downloadExcel(): void {
    this.http.get('http://localhost:8000/orders/', { responseType: 'blob' })
      .subscribe((response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ordenes.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
