import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

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

  constructor(private fb: FormBuilder,private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      email: [{ value: '', disabled: true }],
      dni: ['', [Validators.required, Validators.min(1000000), Validators.max(99999999)]],
      shift: ['', Validators.required],
      grade_year: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]]
    });
    this.loadProfile();
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
}
