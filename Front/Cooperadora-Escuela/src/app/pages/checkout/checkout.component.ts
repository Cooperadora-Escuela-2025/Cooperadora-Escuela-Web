import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { Product } from '../product.model';
import { ApiService } from '../api.service';
import { CartService } from '../services/cart.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, FooterComponent, HeaderComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})

export class CheckoutComponent implements OnInit {
  cart: any[] = [];
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
  ) { }

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    this.total = this.cart.reduce(
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
      products: this.cart.map((product) => ({
        product: product.id, // Enviar el ID del producto
        unit_price: product.price, // Enviar el precio unitario
        quantity: product.quantity || 1, // Enviar la cantidad
      })),
    };

    console.log('Datos enviados al backend:', order); // <-- Agrega este console.log

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
    this.http.get('http://localhost:8000/download-orders/', { responseType: 'blob' })
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