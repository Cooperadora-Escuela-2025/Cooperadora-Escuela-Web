import { Component } from '@angular/core';

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
export class PaymentPendingComponent {}
