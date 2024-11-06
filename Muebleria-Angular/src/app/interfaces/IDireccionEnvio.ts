export interface IDireccionEnvio {
  id: number;
  nombreDireccion: string;
  esPredeterminada: boolean;
  calle: string;
  numero: string;
  colonia: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  personaId: number; // Foreign key
}
