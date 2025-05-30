import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-pending',
  standalone: true,
  template: `
    <div class="container mt-5 text-center">
      <h2 class="text-warning">Pago pendiente</h2>
      <p>Tu pago está en proceso. Te notificaremos cuando se confirme.</p>
    </div>
  `,
})
export class PaymentPendingComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Redirigir a la página de productos después de 5 segundos
    setTimeout(() => {
      this.router.navigate(['/products']);
    }, 5000);
  }
}