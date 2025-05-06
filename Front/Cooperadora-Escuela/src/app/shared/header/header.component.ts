import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private router: Router) { }

  logout(): void {
    // Aquí puedes agregar la lógica para cerrar la sesión (por ejemplo, eliminar el token de autenticación).
    this.router.navigate(['/login']);
  }

}
