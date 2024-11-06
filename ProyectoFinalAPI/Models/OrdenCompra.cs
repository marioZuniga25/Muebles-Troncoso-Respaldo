using System.ComponentModel.DataAnnotations.Schema;

namespace ProyectoFinalAPI.Models
{
 public class OrdenCompra
 {
  public int idOrdenCompra { get; set; }
  public int idProveedor { get; set; }
  public DateTime fechaCompra { get; set; }
public string usuario { get; set; }
  public ICollection<DetalleOrdenCompra> Detalles { get; set; }
 }


}
