namespace ProyectoFinalAPI.Models
{
    public class Pedidos
    {
        public int idPedido {get; set;}
        public int idVenta { get; set; }
        public int idUsuario { get; set;}
        public int idTarjeta {get; set;}
        public string nombre { get; set;}
        public string apellidos { get; set;}
        public string telefono { get; set;}
        public string correo { get; set; }
        public string calle { get; set;}
        public string numero { get; set;}
        public string colonia {get; set;}
        public string ciudad { get; set;}
        public string estado { get; set;}
        public string codigoPostal {get; set;}
        public string estatus {get; set;}
    }
}
