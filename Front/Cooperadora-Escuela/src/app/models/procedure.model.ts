export interface Procedure {
  id?: number;
  procedure_type: string;
  procedure_type_display?: string;//opcional
  description: string;
  request_date: string;
  status: string;
  user: number; 
}