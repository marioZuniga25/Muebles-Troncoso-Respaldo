namespace ProyectoFinalAPI.Dto
{
    public class VentaDto
    {
        public int IdVenta { get; set; }
        public decimal Total { get; set; }
        public DateTime FechaVenta { get; set; }
        public string TipoVenta { get; set; }
        public UsuarioDto Usuario { get; set; }
        public List<DetalleVentaDto> DetalleVentas { get; set; }
    }
}
