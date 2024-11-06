// Services/PromocionesRandomService.cs
using Microsoft.EntityFrameworkCore;
using ProyectoFinalAPI.Models;

namespace ProyectoFinalAPI.Services
{
 public class PromocionesRandomService
 {
  private readonly ProyectoContext _context;

  public PromocionesRandomService(ProyectoContext context)
  {
   _context = context;
  }

  public async Task EjecutarPromocionesAleatorias()
  {
   var productos = await _context.Producto.ToListAsync();
   var random = new Random();

   // Elige 5 productos aleatorios
   var productosAleatorios = productos.OrderBy(x => random.Next()).Take(5).ToList();

   // Crea una nueva promoción aleatoria
   var promocionRandom = new PromocionesRandom
   {
    Codigo = Guid.NewGuid().ToString(),
    Productos = productosAleatorios.Select(p => p.idProducto).ToArray(),
    FechaCreacion = DateTime.Now,
    FechaFin = DateTime.Now.AddHours(1) // Promociones válidas por 1 hora
   };

   _context.PromocionesRandom.Add(promocionRandom);
   await _context.SaveChangesAsync();
  }
 }
}
