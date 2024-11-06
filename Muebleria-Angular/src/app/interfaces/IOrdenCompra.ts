export interface IOrdenCompra {
    idOrdenCompra: number;
    fechaCompra: Date;
    idProveedor: number;
    detalles: IDetalleOrdenCompra[];
  }
  
  export interface IDetalleOrdenCompra {
    idDetalleOrdenCompra: number;
    idOrdenCompra: number;
    idMateriaPrima: number;
    cantidad: number;
    precioUnitario: number;
  }
  