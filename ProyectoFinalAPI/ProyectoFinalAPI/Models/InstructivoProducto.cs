namespace ProyectoFinalAPI.Models
{
    public class InstructivoProducto
    {
        public int id {  get; set; }
        public int idProducto { get; set; }
        public int idMateriaPrima { get; set; }
        public double cantidad {  get; set; }

    }
}
