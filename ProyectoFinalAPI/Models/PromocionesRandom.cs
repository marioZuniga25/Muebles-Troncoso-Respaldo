// Models/PromocionesRandom.cs
using System.ComponentModel.DataAnnotations;

namespace ProyectoFinalAPI.Models
{
 public class PromocionesRandom
 {
  [Key]
  public int IdPromocionRandom { get; set; }
  public string Codigo { get; set; }
  public int[] Productos { get; set; } // IDs de los productos en promoción aleatoria
  public DateTime FechaCreacion { get; set; }
  public DateTime FechaFin { get; set; }
 }
}
