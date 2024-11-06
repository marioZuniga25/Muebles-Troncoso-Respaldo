namespace ProyectoFinalAPI.Dto
{
    public class DetalleVentaDto
    {
        public int IdDetalleVenta { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public ProductoDto Producto { get; set; }
    }
}
