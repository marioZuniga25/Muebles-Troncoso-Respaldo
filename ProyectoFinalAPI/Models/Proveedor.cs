using System.Text.Json.Serialization;

namespace ProyectoFinalAPI.Models
{
 public class Proveedor
 {
  public int idProveedor { get; set; }
  public string nombreProveedor { get; set; }
  public string telefono { get; set; }
  public string correo { get; set; }

  // Relación con MateriaPrima

  public ICollection<MateriaPrima> MateriasPrimas { get; set; }  // Un proveedor puede vender varias materias primas
 }

}
