using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ProyectoFinalAPI.Models
{
 public class DetalleOrdenCompra
 {
  [Key]
  public int idDetalleOrdenCompra { get; set; }
  public int idMateriaPrima { get; set; }
  public int cantidad { get; set; }
  public decimal precioUnitario { get; set; }
 
 }
}