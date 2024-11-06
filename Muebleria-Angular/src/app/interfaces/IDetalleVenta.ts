import { IProducto } from "./IProducto";

export interface IDetalleVenta {
    idDetalleVenta: number;
    idVenta: number;  
    idProducto: number;
    cantidad: number;
    precioUnitario: number;
    producto?: IProducto;
}
  