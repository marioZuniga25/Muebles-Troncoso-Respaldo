import { IProducto } from "./IProducto";

export interface IProductoSeleccionado {
    producto: IProducto;
    cantidad: number;   
    subtotal: number;   
  }