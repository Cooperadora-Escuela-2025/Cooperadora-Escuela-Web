import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,RouterModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  // username: string = '';
  email: string = '';
  password: string = '';
  password2: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService ) {}

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.password !== this.password2) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    const userData = {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      password: this.password,
      password2: this.password2,
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.successMessage = 'Te registraste correctamente 🎉. Redirigiendo al login...';
        setTimeout(() => this.router.navigate(['/login']), 2000); 
      },
      error: (error) => {
        if (error.status === 400 && error.error) {
          this.errorMessage = Object.values(error.error).join(' ');
        } else {
          this.errorMessage = 'Error al registrarse. Intentalo de nuevo.';
        }
      },
    });
  }
}
