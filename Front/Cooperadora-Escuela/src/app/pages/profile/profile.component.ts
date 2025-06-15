import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { Title } from '@angular/platform-browser';
import { CartService } from '../../services/cart.service';
declare var bootstrap: any;
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule,CommonModule,ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'

  
})
export class ProfileComponent {

  profileForm!: FormGroup;
  loading = true;

  shifts = ['Mañana', 'Tarde'];
  gradeYears = [1, 2, 3, 4, 5];
  editMode = false;

  purchaseHistory: any[] = [];
  purchaseHistoryModal: any;

  reservas: any[] = [];
  loadingReservas = false;

  constructor(private fb: FormBuilder,private profileService: ProfileService,private cart:CartService ) {
     
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      first_name: ['', [Validators.minLength(2), Validators.maxLength(30)]],
      last_name: ['', [Validators.minLength(2), Validators.maxLength(30)]],
      email: [{ value: '', disabled: true }],
      dni: ['', [Validators.min(1000000), Validators.max(99999999)]],
      shift: [''],
      grade_year: [''],
      telephone: ['', [Validators.pattern(/^\d{7,15}$/)]]
    });
    this.loadProfile();

    const modalElement = document.getElementById('purchaseHistoryModal');
    if (modalElement) {
      this.purchaseHistoryModal = new bootstrap.Modal(modalElement);
    }
  }

  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profileForm.patchValue({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          dni: data.dni,
          shift: data.shift,
          grade_year: data.grade_year,
          telephone:data.telephone
        });
        this.loading = false;
        console.log(data.telephone);
      },
      error: (err) => {
        console.error('Error cargando perfil', err);
        this.loading = false; 
      }
    });
  }

  saveChanges() {
    if (this.profileForm.valid) {
      const profileData = {
        first_name: this.profileForm.get('first_name')?.value,
        last_name: this.profileForm.get('last_name')?.value,
        dni: this.profileForm.get('dni')?.value,
        shift: this.profileForm.get('shift')?.value,
        grade_year: this.profileForm.get('grade_year')?.value,
        telephone:this.profileForm.get('telephone')?.value
      };

      this.profileService.updateProfile(profileData).subscribe({
        next: () => {
          alert('Perfil actualizado correctamente');
        },
        error: (err) => {
          console.error('Error actualizando perfil', err);
        }
      });
    }
  }

   openPurchaseHistory() {
    this.profileService.getPurchaseHistory().subscribe({
      next: (data) => {
        this.purchaseHistory = data;
        this.purchaseHistoryModal.show();
      },
      error: (err) => {
        console.error('Error al cargar historial:', err);
      }
    });
  }

   closePurchaseHistory() {
    this.purchaseHistoryModal.hide();
  }

  openReservationHistory() {
  this.loadingReservas = true;
  // Llamás al servicio que obtiene las reservas del usuario
  this.cart.getReservasUsuario().subscribe({
    next: (data) => {
      this.reservas = data;
      this.loadingReservas = false;
      // Abrir el modal usando Bootstrap JS o tu método preferido
      const modal = new bootstrap.Modal(document.getElementById('reservationHistoryModal')!);
      modal.show();
    },
    error: (err) => {
      this.loadingReservas = false;
      alert('Error al cargar las reservas.');
      console.error(err);
    }
  });
}

closeReservationHistory() {
  const modalEl = document.getElementById('reservationHistoryModal');
  if (modalEl) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  }
}
}
