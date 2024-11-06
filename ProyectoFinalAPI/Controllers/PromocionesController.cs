// Controllers/PromocionesController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinalAPI.Models;

namespace ProyectoFinalAPI.Controllers
{
 [ApiController]
 [Route("api/[controller]")]
 public class PromocionesController : ControllerBase
 {
  private readonly ProyectoContext _context;

  public PromocionesController(ProyectoContext context)
  {
   _context = context;
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<Promocion>>> GetPromociones()
  {
   return await _context.Promociones.ToListAsync();
  }

  [HttpPost]
  public async Task<ActionResult<Promocion>> CreatePromocion(Promocion promocion)
  {
   _context.Promociones.Add(promocion);
   await _context.SaveChangesAsync();
   return CreatedAtAction(nameof(GetPromociones), new { id = promocion.IdPromocion }, promocion);
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> UpdatePromocion(int id, Promocion promocion)
  {
   if (id != promocion.IdPromocion)
   {
    return BadRequest();
   }

   _context.Entry(promocion).State = EntityState.Modified;

   try
   {
    await _context.SaveChangesAsync();
   }
   catch (DbUpdateConcurrencyException)
   {
    if (!PromocionExists(id))
    {
     return NotFound();
    }
    throw;
   }

   return NoContent();
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> DeletePromocion(int id)
  {
   var promocion = await _context.Promociones.FindAsync(id);
   if (promocion == null)
   {
    return NotFound();
   }

   _context.Promociones.Remove(promocion);
   await _context.SaveChangesAsync();

   return NoContent();
  }

  private bool PromocionExists(int id)
  {
   return _context.Promociones.Any(e => e.IdPromocion == id);
  }
 }
}
