import { IDetalleVenta } from "./IDetalleVenta";

export interface IVenta {
    idVenta?: number;
    idUsuario: number;
    fechaVenta: Date;
    total: number;
    tipoVenta: string;
  }
  
export interface IVentaAux extends IVenta {
    usuario: {
      idUsuario: number;
      nombreUsuario: string;
    };
    detalleVentas: {
      cantidad: number;
      producto: {
        nombreProducto: string;
        precio: number;
      };
    }[];
}
  
