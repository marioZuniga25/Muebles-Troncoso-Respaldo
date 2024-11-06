namespace ProyectoFinalAPI.Models
{
    public class Producto
    {
        public int idProducto { get; set; }
        public string nombreProducto { get; set;}
        public string descripcion { get; set;}
        public double precio { get; set;}
        public int stock { get; set;}
        public string NombreCategoria { get; set; }
        public int idCategoria { get; set;}
        public int idInventario { get; set;}
        public string imagen {get; set;}

    }
}
