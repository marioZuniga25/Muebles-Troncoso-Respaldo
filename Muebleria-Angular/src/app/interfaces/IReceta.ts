export interface IReceta {
    idReceta: number;
    idProducto: number;
    detalles: IRecetaDetalle[];
  }
  
  export interface IRecetaDetalle {
    idRecetaDetalle?: number;
    idMateriaPrima: number;
    cantidad: number;
  }
  