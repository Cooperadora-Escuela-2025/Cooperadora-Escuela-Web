import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5 text-center">
      <h2 class="text-success">¡Pago exitoso!</h2>
      <p *ngIf="paymentId">Tu número de pago es: {{ paymentId }}</p>
    </div>
  `,
})
export class PaymentSuccessComponent implements OnInit {
  paymentId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Obtén el parámetro 'payment-id' de la URL
    this.route.queryParams.subscribe(params => {
      this.paymentId = params['payment-id'];
      if (this.paymentId) {
        console.log('Payment successful, Payment ID:', this.paymentId);
      } else {
        console.error('No se encontró el parámetro payment-id');
      }
    });

    // Redirigir a la página de productos después de 5 segundos
    setTimeout(() => {
      this.router.navigate(['/products']);
    }, 5000);
  }
}