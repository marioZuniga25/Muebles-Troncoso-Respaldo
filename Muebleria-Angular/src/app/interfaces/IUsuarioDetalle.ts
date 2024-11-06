export interface IUsuarioDetalle{
    idUsuario: number | null;
    nombreUsuario:string,
    correo:string,
    contrasenia:string,
    rol:number,
    confirmPassword?: string,
    type:number,
}