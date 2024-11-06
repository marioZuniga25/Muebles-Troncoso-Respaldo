namespace ProyectoFinalAPI.Models
{
    public class DetalleVenta
    {
        public int idDetalleVenta { get; set; }
        public int idVenta { get; set; }
        public int idProducto { get; set;}
        public int cantidad { get; set; }
        public double precioUnitario { get;  set; }

        // public Producto Producto { get; set; }

    }
}
