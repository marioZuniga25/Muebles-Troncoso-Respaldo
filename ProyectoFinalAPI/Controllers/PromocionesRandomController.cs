// Controllers/PromocionesRandomController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinalAPI.Models;

namespace ProyectoFinalAPI.Controllers
{
 [ApiController]
 [Route("api/[controller]")]
 public class PromocionesRandomController : ControllerBase
 {
  private readonly ProyectoContext _context;

  public PromocionesRandomController(ProyectoContext context)
  {
   _context = context;
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<PromocionesRandom>>> GetPromocionesRandom()
  {
   return await _context.PromocionesRandom.ToListAsync();
  }

  // Este endpoint es opcional, ya que las promociones aleatorias se generan automáticamente
  [HttpPost]
  public async Task<ActionResult<PromocionesRandom>> CreatePromocionRandom(PromocionesRandom promocionesRandom)
  {
   _context.PromocionesRandom.Add(promocionesRandom);
   await _context.SaveChangesAsync();
   return CreatedAtAction(nameof(GetPromocionesRandom), new { id = promocionesRandom.IdPromocionRandom }, promocionesRandom);
  }
 }
}
