using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ProyectoFinalAPI.Models
{
    public class Receta
    {
        [Key]
        public int idReceta { get; set; }

        public int idProducto { get; set; }
        public Producto Producto { get; set; }

  public ICollection<RecetaDetalle> Detalles { get; set; }
 }

    public class RecetaDetalle
    {
        [Key]
        public int idRecetaDetalle { get; set; }

        public int idReceta { get; set; }

        [JsonIgnore] 
        public Receta Receta { get; set; }  

        public int idMateriaPrima { get; set; }
        public MateriaPrima MateriaPrima { get; set; }

        public double cantidad { get; set; }
    }
}
