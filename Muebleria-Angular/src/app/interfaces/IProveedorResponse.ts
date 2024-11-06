export interface IProveedorResponse {
  idProveedor: number;
  nombreProveedor: string;
  telefono: string;
  correo: string;
  nombresMateriasPrimas: string[]; // Verifica que el nombre aquí coincida
}


export interface IProveedorRequest {
  idProveedor: number;
  nombreProveedor: string;
  telefono: string;
  correo: string;
  materiasPrimas: {
    nombreMateriaPrima: string;
    descripcion: string;
    idProveedor: number;
    idUnidad: number;
    
    precio: number;
    stock: number;
  }[];
}

