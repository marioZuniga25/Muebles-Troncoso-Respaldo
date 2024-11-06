using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinalAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProyectoFinalAPI.Controllers
{
 [Route("api/[controller]")]
 [ApiController]
 public class UnidadMedidaController : ControllerBase
 {
  private readonly ProyectoContext _context;

  public UnidadMedidaController(ProyectoContext context)
  {
   _context = context;
  }

  // GET: api/UnidadMedida
  [HttpGet]
  public async Task<ActionResult<IEnumerable<UnidadMedida>>> GetUnidadesMedida()
  {
   return await _context.UnidadesMedida.ToListAsync();
  }

  // GET: api/UnidadMedida/5
  [HttpGet("{id}")]
  public async Task<ActionResult<UnidadMedida>> GetUnidadMedida(int id)
  {
   var unidadMedida = await _context.UnidadesMedida.FindAsync(id);

   if (unidadMedida == null)
   {
    return NotFound();
   }

   return unidadMedida;
  }

  // POST: api/UnidadMedida
  [HttpPost]
  public async Task<ActionResult<UnidadMedida>> PostUnidadMedida(UnidadMedida unidadMedida)
  {
   _context.UnidadesMedida.Add(unidadMedida);
   await _context.SaveChangesAsync();

   return CreatedAtAction(nameof(GetUnidadMedida), new { id = unidadMedida.idUnidad }, unidadMedida);
  }
 }
}
