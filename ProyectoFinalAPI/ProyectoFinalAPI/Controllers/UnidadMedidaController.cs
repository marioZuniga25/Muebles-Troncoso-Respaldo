using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinalAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace ProyectoFinalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UnidadMedidaController : ControllerBase
    {
        private readonly ProyectoContext _context;
        private readonly ILogger<UnidadMedidaController> _logger;

        public UnidadMedidaController(ProyectoContext context, ILogger<UnidadMedidaController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/UnidadMedida
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UnidadMedida>>> GetUnidadesMedida()
        {
            try
            {
                var unidades = await _context.UnidadesMedida.ToListAsync();
                _logger.LogInformation("Se han obtenido {Count} unidades de medida.", unidades.Count);
                return unidades;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener las unidades de medida.");
                return StatusCode(500, "Error al obtener las unidades de medida.");
            }
        }

        // GET: api/UnidadMedida/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UnidadMedida>> GetUnidadMedida(int id)
        {
            try
            {
                var unidadMedida = await _context.UnidadesMedida.FindAsync(id);

                if (unidadMedida == null)
                {
                    _logger.LogWarning("Unidad de medida no encontrada: {UnidadMedidaId}", id);
                    return NotFound("Unidad de medida no encontrada.");
                }

                _logger.LogInformation("Unidad de medida encontrada: {UnidadMedidaId}", id);
                return unidadMedida;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener la unidad de medida: {UnidadMedidaId}", id);
                return StatusCode(500, "Error al obtener la unidad de medida.");
            }
        }

        // POST: api/UnidadMedida
        [HttpPost]
        public async Task<ActionResult<UnidadMedida>> PostUnidadMedida(UnidadMedida unidadMedida)
        {
            try
            {
                _context.UnidadesMedida.Add(unidadMedida);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Unidad de medida creada con éxito: {UnidadMedidaId}", unidadMedida.idUnidad);
                return CreatedAtAction(nameof(GetUnidadMedida), new { id = unidadMedida.idUnidad }, unidadMedida);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error al crear la unidad de medida: {UnidadMedida}", unidadMedida);
                return StatusCode(500, "Error al crear la unidad de medida.");
            }
        }
    }
}
