using System.ComponentModel.DataAnnotations;

namespace ProyectoFinalAPI.Models
{
    public class Contacto
    {
        [Key]
        public int IdContacto { get; set; }
        public string Nombre { get; set; }
        public string Correo { get; set; }
        public string Telefono{ get; set;}
        public string Mensaje{ get; set;}
    }
}
