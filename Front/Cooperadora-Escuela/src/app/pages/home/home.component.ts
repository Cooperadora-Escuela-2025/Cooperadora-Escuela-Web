import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

type NoticiaID = 'inscripciones' | 'asamblea' | 'jornada';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,CommonModule,RouterModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  noticiaSeleccionada: NoticiaID | null = null;

  comentario = {
  nombre: '',
  email: '',
  mensaje: ''
};

 constructor() {
   
  }
  
  noticias: Record<NoticiaID, { titulo: string; descripcion: string }> = {
    inscripciones: {
      titulo: 'Inscripciones 2025',
      descripcion: 'Las inscripciones están abiertas hasta el 30 de noviembre en Secretaría. No olvides consultar la documentación a presentar'
    },
    asamblea: {
      titulo: 'Asamblea de la cooperadora',
      descripcion: 'Se realizará el 15 de mayo a las 18hs en el SUM. Se designara a los nuevos Presidente, Vicepresidente y Tesorero. ¡Participá!'
    },
    jornada: {
      titulo: 'Jornada de puertas abiertas',
      descripcion: 'Visitá el colegio este sábado. Actividades, charlas y recorridos guiados.'
    }
  };

  mostrarNoticia(id: NoticiaID) {
    this.noticiaSeleccionada = id;
  }

  cerrarNoticia() {
    this.noticiaSeleccionada = null;
  }

  enviarComentario() {
  if (this.comentario.nombre && this.comentario.email && this.comentario.mensaje) {
   
    alert(`Gracias por tu comentario, ${this.comentario.nombre}!`);
  
    this.comentario = { nombre: '', email: '', mensaje: '' };
  } else {
    alert('Por favor, completa todos los campos.');
  }
}
}
