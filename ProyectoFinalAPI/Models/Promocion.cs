// Models/Promocion.cs
using System.ComponentModel.DataAnnotations;

namespace ProyectoFinalAPI.Models
{
 public class Promocion
 {
  [Key]
  public int IdPromocion { get; set; }
  public string Codigo { get; set; }
  public decimal Descuento { get; set; }
  public DateTime FechaInicio { get; set; }
  public DateTime FechaFin { get; set; }
  public string Estado { get; set; } // Activo/Inactivo
  public int[] Productos { get; set; } // IDs de productos que están en promoción
 }
}
