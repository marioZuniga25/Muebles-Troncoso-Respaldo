namespace ProyectoFinalAPI.Models
{
    public class Venta
    {
        public int idVenta{ get; set; }
        public int idUsuario { get; set; }
        public DateTime fechaVenta{ get; set; }
        public double total { get; set; }
        public string tipoVenta { get; set; } // "Online" o "Fisica"
    }
}
