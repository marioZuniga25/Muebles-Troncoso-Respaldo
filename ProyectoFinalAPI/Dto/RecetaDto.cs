public class RecetaDto
{
    public int IdReceta { get; set; }
    public int IdProducto { get; set; }
    public List<RecetaDetalleDto> Detalles { get; set; }
}

public class RecetaDetalleDto
{
    public int IdRecetaDetalle { get; set; }
    public int IdMateriaPrima { get; set; }
    public int Cantidad { get; set; }
}
