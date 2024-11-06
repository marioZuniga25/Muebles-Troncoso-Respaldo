import { IPersona } from "./IPersona";

export interface User {
    idUsuario: number;
    nombreUsuario: string;
    correo: string;
    contrasenia: string;
    rol: number;
    persona?: IPersona;
  }
  
  export interface AuthResponse {
    message: string;
    user: User;
  }
  