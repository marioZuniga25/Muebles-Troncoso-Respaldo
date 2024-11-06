namespace ProyectoFinalAPI.Models
{
    public class Tarjetas
    {
        public int idTarjeta { get; set; }
        public int idUsuario { get; set; }
        public string nombrePropietario { get; set; }
        public string numeroTarjeta{ get; set; }
        public string fechaVencimiento { get; set; }
        public string ccv { get; set;}
    }
}
