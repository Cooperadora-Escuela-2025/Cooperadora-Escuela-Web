import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Procedure } from '../../models/procedure.model';
import { ProcedureService } from '../../services/procedure.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
// instalar npm install --save-dev @types/file-saver
import { ProfileService } from '../../services/profile.service';





@Component({
  selector: 'app-procedures',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './procedures.component.html',
  styleUrl: './procedures.component.css'
})


export class ProceduresComponent implements OnInit{

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  successMessageShown = false;
  procedures: Procedure[] = [];
  alumno: any = {};
  archivoComprobante: File | null = null;
  tipo: string = '';
  mes: number | null = null;
  anio: number = new Date().getFullYear();
  cuotaCreada: any = null;
  mensaje: string = '';
  qrUrl: string | null = null;
  mostrarQR = false;
  responsable:any={};
  tutorNombre: string = '';
tutorApellido: string = '';
tutorDni: string = '';
parentesco: string = '';
  
  newProcedure: Procedure = {
    procedure_type: '',
    description: '',
    request_date: '',
    status: 'Pendiente',
    user: 0 
  }

constructor(private procedureService: ProcedureService,private fb: FormBuilder,private profileService:ProfileService) {
   
  
 }

  ngOnInit(): void {
    // this.getProcedures();
        this.profileService.getProfile().subscribe({
      next: (data) => this.alumno = data,
      error: () => console.error('Error al cargar los datos del alumno')
    });

  }

onFileSelected(event: any) {
    this.archivoComprobante = event.target.files[0];
  }

  

  tiposCuota = [
    { value: 'mensual', label: 'Cuota mensual' },
    { value: 'anual', label: 'Cuota anual' },
    { value: 'reincorporacion', label: 'Reincorporación' },
    { value: 'extra', label: 'Extraordinaria' }
  ];

  meses = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];

crearCuota() {
    const datos: any = {
      tipo: this.tipo,
      anio: this.anio
    };

    if (this.tipo === 'mensual') {
      datos.mes = this.mes;
    }

    this.procedureService.crearCuota(datos).subscribe({
      next: (cuota) => {
        this.cuotaCreada = cuota;
        this.mensaje = 'Cuota creada correctamente';
      },
      error: () => {
        this.mensaje = 'Error al crear la cuota.';
      }
    });

    
  }

cargarQr(cuotaId: number) {
  this.procedureService.obtenerQrPago(cuotaId).subscribe(blob => {
    const url = URL.createObjectURL(blob);
    this.qrUrl = url;
    this.mostrarQR = true;
  }, error => {
    console.error('Error al cargar el QR:', error);
  });
}


 descargarComprobante() {
    if (!this.cuotaCreada) return;

    this.procedureService.descargarComprobante(this.cuotaCreada.id).subscribe(blob => {
      saveAs(blob, `comprobante_cuota_${this.cuotaCreada.id}.pdf`);
    });
  }
  
  enviarComprobante() {
    if (!this.archivoComprobante) {
      this.mensaje = 'Debes seleccionar un archivo.';
      return;
    }

    const formData = new FormData();
    formData.append('archivo', this.archivoComprobante);
    formData.append('alumno_nombre', this.alumno.first_name);
    formData.append('alumno_apellido', this.alumno.last_name);
    formData.append('alumno_dni', this.alumno.dni);
    formData.append('tutor_nombre', this.tutorNombre);
    formData.append('tutor_apellido', this.tutorApellido);
    formData.append('tutor_dni', this.tutorDni);
    formData.append('parentesco', this.parentesco);

    this.procedureService.subirComprobante(formData).subscribe({
      next: () => {
        this.mensaje = 'Comprobante enviado correctamente.';
        this.archivoComprobante = null;
        this.tutorNombre = '';
        this.tutorApellido = '';
        this.tutorDni = '';
        this.parentesco = '';

      
        if (this.fileInput && this.fileInput.nativeElement) {
          this.fileInput.nativeElement.value = '';
        }
      },
      error: (err) => {
        console.error(err);
        this.mensaje = 'Ocurrió un error al enviar el comprobante.';
      }
    });
}

}

