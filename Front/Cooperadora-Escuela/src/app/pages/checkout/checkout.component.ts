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

  if (this.paymentMethod === 'mercadopago') {
    // Primero guardar la orden (opcional según tu lógica)
    this.apiService.createOrder(order).subscribe({
      next: () => {
        // Luego crear la preferencia de Mercado Pago
        this.http.post<{ init_point: string }>('http://localhost:8000/create_preference/', order).subscribe({
          next: (response) => {
            window.location.href = response.init_point; // Redirige a Mercado Pago
          },
          error: (error) => {
            console.error('Error creando preferencia de pago:', error);
            alert('No se pudo iniciar el pago con Mercado Pago.');
          }
        });
      },
      error: (error) => {
        console.error('Error al crear la orden:', error);
        alert('Hubo un error al procesar la orden.');
      },
    });
  } else {
    // Flujo para pago en efectivo
    this.apiService.createOrder(order).subscribe({
      next: () => {
        alert(`Compra con ${this.paymentMethod} exitosa.`);
        this.cartService.clearCart();
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Error al crear la orden:', error);
        alert('Hubo un error al procesar la orden.');
      },
    });
  }


    console.log('Datos enviados al backend:', order);

    this.apiService.createOrder(order).subscribe({
      next: () => {
        alert(`Compra con ${this.paymentMethod} exitosa.`);
        this.cartService.clearCart();
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Error al crear la orden:', error);
        alert('Hubo un error al procesar la orden.');
      },
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
