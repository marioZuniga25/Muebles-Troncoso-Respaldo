using System.ComponentModel.DataAnnotations;

using System.ComponentModel.DataAnnotations;

namespace ProyectoFinalAPI.Models
{
 // En MateriaPrima.cs
public class MateriaPrima
{
[Key]
    public int idMateriaPrima { get; set; }
    public string nombreMateriaPrima { get; set; }
    public string descripcion { get; set; }
    public int idUnidad { get; set; }
    public decimal precio { get; set; }
    public double stock { get; set; } // Nueva propiedad para el stock

 }


}
