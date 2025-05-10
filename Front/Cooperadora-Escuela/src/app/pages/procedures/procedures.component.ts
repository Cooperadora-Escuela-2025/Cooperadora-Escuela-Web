import { Component, OnInit } from '@angular/core';
import { Procedure } from '../../models/procedure.model';
import { ProcedureService } from '../../services/procedure.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-procedures',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './procedures.component.html',
  styleUrl: './procedures.component.css'
})
export class ProceduresComponent implements OnInit{

  procedures: Procedure[] = [];
  newProcedure: Procedure = {
    procedure_type: '',
    description: '',
    request_date: '',
    status: 'Pending',
    user: 0 
  };

constructor(private procedureService: ProcedureService) { }

  ngOnInit(): void {
    this.getProcedures();
  }


  // Obtener trámites del backend
  getProcedures(): void {
    this.procedureService.getProcedures().subscribe(
      (procedures) => {
        this.procedures = procedures;
      },
      (error) => {
        console.error('Error fetching procedures:', error);
      }
    );
  }

   // Crear un nuevo trámite
  createProcedure(): void {
    this.procedureService.createProcedure(this.newProcedure).subscribe(
      (procedure) => {
        this.procedures.push(procedure); 
        this.newProcedure = { procedure_type: '', description: '', request_date: '', status: 'Pendiente', user: 0 }; 
      },
      (error) => {
        console.error('error al crear tramite', error);
      }
    );
  }
}
