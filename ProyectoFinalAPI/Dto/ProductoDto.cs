public class ProductoDto
{
    public int IdProducto { get; set; }
    public string NombreProducto { get; set; }
    public string Descripcion { get; set; }
    public double Precio { get; set; }
    public int Stock { get; set; }
    public string NombreCategoria { get; set; }  // Aquí es donde se devuelve el nombre de la categoría
    public int IdInventario { get; set; }
    public int IdCategoria { get; set; }
    public string Imagen { get; set; }
}
