import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactoForm: FormGroup;
  enviadoConExito = false;
  mostrarError = false;

  constructor(private fb: FormBuilder) {
    this.contactoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      asunto: ['', [Validators.required]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit(): void {
    if (this.contactoForm.valid) {
      console.log('Formulario enviado:', this.contactoForm.value);

      this.enviadoConExito = true;
      this.mostrarError = false;
      this.contactoForm.reset();

      // Oculta el mensaje después de 4 segundos
      setTimeout(() => this.enviadoConExito = false, 4000);
    } else {
      this.mostrarError = true;
      this.enviadoConExito = false;

      this.contactoForm.markAllAsTouched();
      setTimeout(() => this.mostrarError = false, 4000);
    }
  }
}
