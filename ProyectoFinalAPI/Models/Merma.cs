using System.ComponentModel.DataAnnotations;

namespace ProyectoFinalAPI.Models
{
    public class Merma
    {
        [Key]
        public int IdMerma { get; set; }
        public string Nombre { get; set; }
        public DateTime fechaMerma { get; set; }
        public int idMateria { get; set; }
        public int cantidad { get; set; }
        public string unidadMedida { get; set; }
        public string causa { get; set; }
        public string comentarios { get; set; }
        public int idUsuario { get; set; }
    }
}
