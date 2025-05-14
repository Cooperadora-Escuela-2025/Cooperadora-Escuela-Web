import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5 text-center">
      <h2 class="text-success">¡Pago exitoso!</h2>
      <!-- <p>Gracias por su compra. En breve recibirá un correo con la confirmación.</p> -->
       <p *ngIf="paymentId">Tu número de pago es: {{ paymentId }}</p>
    </div>
  `,
})
export class PaymentSuccessComponent  implements OnInit{
   paymentId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtén el parámetro 'preference-id' de la URL
    this.route.queryParams.subscribe(params => {
      this.paymentId = params['payment-id'];
      if (this.paymentId) {
        // Aquí puedes realizar acciones adicionales, como verificar el estado del pago
        console.log('Payment successful, Preference ID:', this.paymentId);
        // Realiza cualquier validación adicional con el ID de preferencia
      } else {
        console.error('No se encontró el parámetro preference-id');
      }
    });
  }
}

