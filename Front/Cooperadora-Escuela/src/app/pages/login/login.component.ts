import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule,RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = ''; 

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.successMessage = 'Inicio de sesión exitoso 🎉. Redirigiendo...';
          const user = JSON.parse(localStorage.getItem('user')!);
          setTimeout(() => {
            if (user?.is_staff) {
        
              this.router.navigate(['/home']);
            } else {
              this.router.navigate(['/home']);
            }
          }, 1000); 
        },
        error: err => {
          this.errorMessage = 'Correo o contraseña incorrectos.';
          console.error('Error al iniciar sesión', err);
        }
      });
    } else {
      this.errorMessage = 'Por favor completá todos los campos correctamente.';
    }
  }

  // signOut():void{
  //   this.authService.logout();
  // }
}
