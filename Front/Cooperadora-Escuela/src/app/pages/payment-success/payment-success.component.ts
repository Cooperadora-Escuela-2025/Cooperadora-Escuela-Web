import { Component } from '@angular/core';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  template: `
    <div class="container mt-5 text-center">
      <h2 class="text-success">¡Pago exitoso!</h2>
      <p>Gracias por su compra. En breve recibirá un correo con la confirmación.</p>
    </div>
  `,
})
export class PaymentSuccessComponent {}

