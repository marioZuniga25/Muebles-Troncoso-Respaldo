using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinalAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace ProyectoFinalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TarjetasController : ControllerBase
    {
        private readonly ProyectoContext _context;
        private readonly ILogger<TarjetasController> _logger;

        public TarjetasController(ProyectoContext context, ILogger<TarjetasController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // POST: api/Tarjetas
        [HttpPost]
        public async Task<ActionResult<Tarjetas>> PostTarjeta(Tarjetas tarjeta)
        {
            try
            {
                _context.Tarjetas.Add(tarjeta);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Tarjeta creada con éxito: {TarjetaId}", tarjeta.idTarjeta);
                return CreatedAtAction(nameof(GetTarjetaById), new { id = tarjeta.idTarjeta }, tarjeta);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error al crear la tarjeta: {Tarjeta}", tarjeta);
                return StatusCode(500, "Error al crear la tarjeta.");
            }
        }

        // GET: api/Tarjetas/usuario/{idUsuario}
        [HttpGet("usuario/{idUsuario}")]
        public async Task<ActionResult<IEnumerable<Tarjetas>>> GetTarjetasByUsuario(int idUsuario)
        {
            try
            {
                var tarjetas = await _context.Tarjetas.Where(t => t.idUsuario == idUsuario).ToListAsync();
                if (tarjetas == null || tarjetas.Count == 0)
                {
                    _logger.LogWarning("No se encontraron tarjetas para el usuario: {UsuarioId}", idUsuario);
                    return NotFound("No se encontraron tarjetas.");
                }
                _logger.LogInformation("Se encontraron {Count} tarjetas para el usuario: {UsuarioId}", tarjetas.Count, idUsuario);
                return tarjetas;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener tarjetas para el usuario: {UsuarioId}", idUsuario);
                return StatusCode(500, "Error al obtener las tarjetas.");
            }
        }

        // DELETE: api/Tarjetas/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTarjeta(int id)
        {
            try
            {
                var tarjeta = await _context.Tarjetas.FindAsync(id);
                if (tarjeta == null)
                {
                    _logger.LogWarning("Tarjeta no encontrada para eliminación: {TarjetaId}", id);
                    return NotFound("Tarjeta no encontrada.");
                }

                _context.Tarjetas.Remove(tarjeta);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Tarjeta eliminada con éxito: {TarjetaId}", id);
                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error al eliminar la tarjeta: {TarjetaId}", id);
                return StatusCode(500, "Error al eliminar la tarjeta.");
            }
        }

        // GET: api/Tarjetas/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Tarjetas>> GetTarjetaById(int id)
        {
            try
            {
                var tarjeta = await _context.Tarjetas.FindAsync(id);
                if (tarjeta == null)
                {
                    _logger.LogWarning("Tarjeta no encontrada: {TarjetaId}", id);
                    return NotFound("Tarjeta no encontrada.");
                }
                _logger.LogInformation("Tarjeta encontrada: {TarjetaId}", id);
                return tarjeta;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener la tarjeta: {TarjetaId}", id);
                return StatusCode(500, "Error al obtener la tarjeta.");
            }
        }
    }
}
