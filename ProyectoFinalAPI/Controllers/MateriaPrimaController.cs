using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinalAPI.Dto;
using ProyectoFinalAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProyectoFinalAPI.Controllers
{
 [Route("api/[controller]")]
 [ApiController]
 public class MateriasPrimasController : ControllerBase
 {
  private readonly ProyectoContext _context;

  public MateriasPrimasController(ProyectoContext context)
  {
   _context = context;
  }

  // GET: api/MateriasPrimas
  [HttpGet]
  public async Task<ActionResult<IEnumerable<MateriaPrimaDTO>>> GetMateriasPrimas()
  {
   var materiasPrimas = await _context.MateriasPrimas
       .ToListAsync();

   // Convertimos cada entidad MateriaPrima a MateriaPrimaDTO
   var materiasPrimasDto = materiasPrimas.Select(mp => new MateriaPrimaDTO
   {
    NombreMateriaPrima = mp.nombreMateriaPrima,
    Descripcion = mp.descripcion,
    Precio = mp.precio,
    Stock = mp.stock,
    idUnidad = mp.idUnidad
   }).ToList();

   return Ok(materiasPrimasDto);
  }

  // GET: api/MateriasPrimas/5
  [HttpGet("{id}")]
  public async Task<ActionResult<MateriaPrimaDTO>> GetMateriaPrima(int id)
  {
   var materiaPrima = await _context.MateriasPrimas
       .Include(mp => mp.idUnidad)
       .FirstOrDefaultAsync(mp => mp.idMateriaPrima == id);

   if (materiaPrima == null)
   {
    return NotFound();
   }

   var materiaPrimaDto = new MateriaPrimaDTO
   {
    NombreMateriaPrima = materiaPrima.nombreMateriaPrima,
    Descripcion = materiaPrima.descripcion,
    Precio = materiaPrima.precio,
    Stock = materiaPrima.stock,
    idUnidad = materiaPrima.idUnidad
   };

   return Ok(materiaPrimaDto);
  }

  // POST: api/MateriasPrimas
  [HttpPost]
  public async Task<ActionResult<MateriaPrima>> PostMateriaPrima(MateriaPrima materiaPrima)
  {
   _context.MateriasPrimas.Add(materiaPrima);
   await _context.SaveChangesAsync();

   return CreatedAtAction("GetMateriaPrima", new { id = materiaPrima.idMateriaPrima }, materiaPrima);
  }

  // DELETE: api/MateriasPrimas/5
  [HttpDelete("{id}")]
  public async Task<IActionResult> DeleteMateriaPrima(int id)
  {
   var materiaPrima = await _context.MateriasPrimas.FindAsync(id);
   if (materiaPrima == null)
   {
    return NotFound();
   }

   _context.MateriasPrimas.Remove(materiaPrima);
   await _context.SaveChangesAsync();

   return NoContent();
  }

  private bool MateriaPrimaExists(int id)
  {
   return _context.MateriasPrimas.Any(e => e.idMateriaPrima == id);
  }



  [HttpGet("ListarMateriasPrimas")]
  public async Task<ActionResult<IEnumerable<MateriaPrima>>> ListarMateriasPrimas()
  {
   var materiasPrimas = await _context.MateriasPrimas.ToListAsync();
   return Ok(materiasPrimas);
  }
 }
}
