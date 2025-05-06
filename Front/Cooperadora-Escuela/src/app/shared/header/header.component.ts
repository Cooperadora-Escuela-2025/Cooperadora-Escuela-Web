import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router: Router) { }

  logout(): void {
    // Aquí puedes agregar la lógica para cerrar la sesión (por ejemplo, eliminar el token de autenticación).
    this.router.navigate(['/login']); // Redirige al login
  }

}
