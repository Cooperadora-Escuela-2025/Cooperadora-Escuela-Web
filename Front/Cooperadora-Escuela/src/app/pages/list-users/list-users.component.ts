import { Component } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css'
})
export class ListUsersComponent {
  users: any[] = []; 
  editingUserId: number | null = null;  
  editData: any = {};  

  formData = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: ''
  };

  constructor(
    private profileService: ProfileService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();  
  }

   crearUsuario() {
    const token = localStorage.getItem('access_token'); // o como guardes el JWT del admin
    if (!token) {
      alert('No estás autenticado.');
      return;
    }
    this.profileService.createUserByAdmin(this.formData, token).subscribe({
      next: (res) => {
        console.log(res);
        alert('Usuario creado con éxito.');
         this.loadUsers();
         this.resetFormulario();
      },
      error: (err) => {
        console.error(err);
        alert('Ocurrió un error al crear el usuario.');
      }
    });
  }

  // para cargar todos los usuarios desde el backend
  loadUsers(): void {
    this.profileService.getAllProfiles().subscribe({
      next: (data) => {
        console.log(data);
        this.users = data;  
      },
      error: (err) => {
        console.error('Error al cargar los usuarios:', err);
      }
    });
  }

  // inicia la edición de un usuario
  editUser(userId: number): void {
    this.editingUserId = userId;  
    const user = this.users.find(u => u.id === userId);
    console.log(this.users+'aqui');
    if (user) {
      this.editData = { ...user };  
      console.log(this.editData);
    }
  }
  

  //guarda los cambios realizados a un usuario
  saveUser(): void {
    if (this.editData.id !== undefined) {
      
      this.profileService.updateProfileById(this.editData.id, this.editData).subscribe({
        next: (updatedUser) => {
         
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
            console.log('Campos editados:', this.editData);
          }
          this.editingUserId = null;  
        },
        error: (err) => {
          console.error('Error al guardar el perfil:', err);
        }
      });
    }
  }

  //cancela la edición y vuelve al modo de vista
  cancelEdit(): void {
    this.editingUserId = null;  
    this.editData = {};  
  }

  //elimina un usuario
  deleteUser(userId: number): void {
     const confirmado = confirm('¿Estás seguro de que querés eliminar este usuario? Esta acción no se puede deshacer.');
       console.log('Confirmación:', confirmado); 

    if (!confirmado) {
    return; // si el admin cancela no se elimina
  }

  this.profileService.deleteProfile(userId).subscribe({
    next: () => {
      this.users = this.users.filter(u => u.id !== userId);
    },
    error: (err) => {
      console.error('Error al eliminar el usuario:', err);
    }
  });
  }

resetFormulario() {
  this.formData = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: ''
  };
}

}