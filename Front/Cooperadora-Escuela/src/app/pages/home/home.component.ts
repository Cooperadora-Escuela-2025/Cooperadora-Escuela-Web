import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

const noticiasData = {
  feriaCiencias: {
    titulo: '🔬 Feria de Ciencias',
    descripcion: 'Presentación de proyectos científicos por los alumnos\n📅 15 de Septiembre\n📍 Auditorio principal'
  },
  diaEstudiante: {
    titulo: '🎉 Día del Estudiante',
    descripcion: 'Juegos y actividades recreativas para todos los cursos\n📅 21 de Septiembre\n📍 Patio central'
  },
  obraTeatro: {
    titulo: '🎭 Obra de Teatro',
    descripcion: 'Función teatral a cargo de estudiantes de 5to año\n📅 10 de Octubre\n📍 Sala de actos'
  },
  torneoFutbol: {
    titulo: '⚽ Torneo de Fútbol',
    descripcion: 'Competencia deportiva entre cursos\n📅 5 de Noviembre\n📍 Cancha deportiva'
  },
  excursion: {
    titulo: '🚌 Excursión Escolar',
    descripcion: 'Salida educativa al museo local con docentes\n📅 20 de Noviembre\n📍 Museo de Ciencias Naturales'
  },
  tallerLectura: {
    titulo: '📖 Taller de Lectura Familiar',
    descripcion: 'Actividad compartida entre padres, madres e hijos\n📅 30 de Septiembre\n📍 Biblioteca'
  },
  muestraArte: {
    titulo: '🖼️ Muestra de Arte',
    descripcion: 'Exposición de trabajos artísticos realizados en clases\n📅 12 de Octubre\n📍 Galería de Arte'
  },
  feriaPlato: {
    titulo: '🍽️ Feria del Plato',
    descripcion: 'Venta de comidas caseras para recaudar fondos escolares\n📅 8 de Octubre\n📍 Patio de comidas'
  },
  festivalTalentos: {
    titulo: '🎤 Festival de Talentos',
    descripcion: 'Alumnos presentan habilidades: canto, baile y más\n📅 25 de Octubre\n📍 Auditorio principal'
  },
  limpieza: {
    titulo: '🧼 Jornada de Limpieza',
    descripcion: 'Actividad colaborativa entre padres y alumnos para embellecer la escuela\n📅 3 de Octubre\n📍 Todo el colegio'
  },
  // diaFamilia: {
  //   titulo: '👪 Día de la Familia',
  //   descripcion: 'Juegos y actividades para disfrutar en comunidad\n📅 18 de Noviembre\n📍 Patio central'
  // },
 
} as const;

type NoticiaID = keyof typeof noticiasData;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  noticiaSeleccionada: NoticiaID | null = null;

  noticias = noticiasData;

  comentario = {
    nombre: '',
    email: '',
    mensaje: ''
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

  get clavesNoticias(): NoticiaID[] {
  return Object.keys(this.noticias) as NoticiaID[];
}
}
