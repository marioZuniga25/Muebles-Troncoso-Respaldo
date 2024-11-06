export interface IPedidos {
  idPedido: number;
  idVenta: number;
  idUsuario: number;
  idTarjeta: number;
  nombre: string;
  apellidos: string;
  telefono: string;
  correo: string;
  calle: string;
  numero: string;
  colonia: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  estatus: string;
}

// producto-detalle.model.ts
export interface IProductoDetalle {
idProducto: number;
nombreProducto: string;
descripcion: string;
precioUnitario: number;
cantidad: number;
imagen: string;
}

export interface IPedidosResponse {
idPedido: number;
idVenta: number;
nombre: string;
apellidos: string;
telefono: string;
correo: string;
calle: string;
numero: string;
colonia: string;
ciudad: string;
estado: string;
codigoPostal: string;
estatus: string;
productos: IProductoDetalle[];
}
