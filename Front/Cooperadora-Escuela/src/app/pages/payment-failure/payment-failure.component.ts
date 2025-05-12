import { Component } from '@angular/core';

@Component({
  selector: 'app-payment-failure',
  standalone: true,
  template: `
    <div class="container mt-5 text-center">
      <h2 class="text-danger">Error en el pago</h2>
      <p>Hubo un problema al procesar el pago. Por favor, intentá nuevamente.</p>
    </div>
  `,
})
export class PaymentFailureComponent {}
