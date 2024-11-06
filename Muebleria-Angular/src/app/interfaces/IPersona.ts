import { IDireccionEnvio } from "./IDireccionEnvio";

export interface IPersona {
    id: number;
    nombre: string;
    apellidos: string;
    telefono: string;
    correo: string;
    usuarioId: number;
    direccionesEnvio?: IDireccionEnvio[];
  }
  