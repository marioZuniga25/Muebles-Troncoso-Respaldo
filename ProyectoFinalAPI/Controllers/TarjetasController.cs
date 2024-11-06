using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinalAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace ProyectoFinalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TarjetasController : ControllerBase
    {
        private readonly ProyectoContext _context;

        public TarjetasController(ProyectoContext context)
        {
            _context = context;
        }

        // POST: api/Tarjetas
        [HttpPost]
        public async Task<ActionResult<Tarjetas>> PostTarjeta(Tarjetas tarjeta)
        {
            _context.Tarjetas.Add(tarjeta);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTarjetaById), new { id = tarjeta.idTarjeta }, tarjeta);
        }

        // GET: api/Tarjetas/usuario/{idUsuario}
        [HttpGet("usuario/{idUsuario}")]
        public async Task<ActionResult<IEnumerable<Tarjetas>>> GetTarjetasByUsuario(int idUsuario)
        {
            var tarjetas = await _context.Tarjetas.Where(t => t.idUsuario == idUsuario).ToListAsync();
            if (tarjetas == null || tarjetas.Count == 0)
            {
                return NotFound();
            }
            return tarjetas;
        }

        // DELETE: api/Tarjetas/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTarjeta(int id)
        {
            var tarjeta = await _context.Tarjetas.FindAsync(id);
            if (tarjeta == null)
            {
                return NotFound();
            }

            _context.Tarjetas.Remove(tarjeta);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Tarjetas>> GetTarjetaById(int id)
        {
            var tarjeta = await _context.Tarjetas.FindAsync(id);
            if (tarjeta == null)
            {
                return NotFound();
            }
            return tarjeta;
        }
    }
}
