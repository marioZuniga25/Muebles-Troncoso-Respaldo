namespace ProyectoFinalAPI.Models
{
    public class PedidoDetalleDto
    {
        public int idPedido { get; set; }
        public int idVenta { get; set; }
        public string nombre { get; set; }
        public string apellidos { get; set; }
        public string telefono { get; set; }
        public string correo { get; set; }
        public string calle { get; set; }
        public string numero { get; set; }
        public string colonia { get; set; }
        public string ciudad { get; set; }
        public string estado { get; set; }
        public string codigoPostal { get; set; }
        public string estatus { get; set; }

        public List<DetalleProducto> Productos { get; set; }
    }

    public class DetalleProducto
    {
        public int idProducto { get; set; }
        public string nombreProducto { get; set; }
        public string descripcion { get; set; }
        public double precioUnitario { get; set; }
        public int cantidad { get; set; }
        public string imagen { get; set; } 
    }
}
