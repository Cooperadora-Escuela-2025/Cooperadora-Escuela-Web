import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  userDate: any;
  
    constructor(private router: Router,public authService: AuthService) { }
  
    ngOnInit(): void {
      this.userDate = this.authService.getUserFromStorage();
    }
  
  
    logout(): void {
      this.authService.logout();
    }
  
    //para mostrar el nav al user logeado
    getUserDate(): void {
      const user = this.authService.getUserFromStorage();
      if (user && user.id) {
        this.authService.getUser(user.id).subscribe({
          next: (userData) => this.userDate = userData,
          error: (err) => console.error('Error al obtener el perfil', err)
        });
      } else {
        console.warn('No hay usuario en sesión');
      }
  }
}
