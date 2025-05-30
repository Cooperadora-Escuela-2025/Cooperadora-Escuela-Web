import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
export class PaymentFailureComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Redirigir a la página de productos después de 5 segundos
    setTimeout(() => {
      this.router.navigate(['/products']);
    }, 5000);
  }
}