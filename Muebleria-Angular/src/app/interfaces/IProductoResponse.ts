export interface IProductoResponse{
    idProducto: number;
    idCategoria: number;
    idInventario: number;
    nombreProducto: string;
    nombreCategoria: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagen: string;
}

export interface IProductoRequest{
    idProducto: number;
    idCategoria: number;
    idInventario: number;
    nombreProducto: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagen: string;
    nombreCategoria: string;
}