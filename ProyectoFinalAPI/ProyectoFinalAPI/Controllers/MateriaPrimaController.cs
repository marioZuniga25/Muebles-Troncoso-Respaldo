using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinalAPI.Dto;
using ProyectoFinalAPI.Models;
using Serilog;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProyectoFinalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MateriasPrimasController : ControllerBase
    {
        private readonly ProyectoContext _context;
        private readonly ILogger<MateriasPrimasController> _logger;

        public MateriasPrimasController(ProyectoContext context, ILogger<MateriasPrimasController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/MateriasPrimas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MateriaPrimaDTO>>> GetMateriasPrimas()
        {
            try
            {
                _logger.LogInformation("Consultando todas las materias primas");
                var materiasPrimas = await _context.MateriasPrimas.ToListAsync();

                var materiasPrimasDto = materiasPrimas.Select(mp => new MateriaPrimaDTO
                {
                    NombreMateriaPrima = mp.nombreMateriaPrima,
                    Descripcion = mp.descripcion,
                    Precio = mp.precio,
                    Stock = mp.stock,
                    idUnidad = mp.idUnidad
                }).ToList();

                _logger.LogInformation("Materias primas consultadas exitosamente. Total: {total}", materiasPrimasDto.Count);
                return Ok(materiasPrimasDto);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al consultar materias primas: {ex.Message}");
                return StatusCode(500, "Error interno del servidor.");
            }
        }

        // GET: api/MateriasPrimas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MateriaPrimaDTO>> GetMateriaPrima(int id)
        {
            try
            {
                _logger.LogInformation("Consultando materia prima con ID: {id}", id);
                var materiaPrima = await _context.MateriasPrimas
                    .Include(mp => mp.idUnidad)
                    .FirstOrDefaultAsync(mp => mp.idMateriaPrima == id);

                if (materiaPrima == null)
                {
                    _logger.LogWarning("Materia prima con ID: {id} no encontrada", id);
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

                _logger.LogInformation("Materia prima con ID: {id} consultada exitosamente", id);
                return Ok(materiaPrimaDto);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al consultar materia prima con ID {id}: {ex.Message}");
                return StatusCode(500, "Error interno del servidor.");
            }
        }

        // POST: api/MateriasPrimas
        [HttpPost]
        public async Task<ActionResult<MateriaPrima>> PostMateriaPrima(MateriaPrima materiaPrima)
        {
            try
            {
                _logger.LogInformation("Creando nueva materia prima: {nombre}", materiaPrima.nombreMateriaPrima);
                _context.MateriasPrimas.Add(materiaPrima);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Materia prima creada exitosamente con ID: {id}", materiaPrima.idMateriaPrima);
                return CreatedAtAction("GetMateriaPrima", new { id = materiaPrima.idMateriaPrima }, materiaPrima);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al crear materia prima: {ex.Message}");
                return StatusCode(500, "Error interno del servidor.");
            }
        }

        // DELETE: api/MateriasPrimas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMateriaPrima(int id)
        {
            try
            {
                _logger.LogInformation("Eliminando materia prima con ID: {id}", id);
                var materiaPrima = await _context.MateriasPrimas.FindAsync(id);
                if (materiaPrima == null)
                {
                    _logger.LogWarning("Materia prima con ID: {id} no encontrada para eliminar", id);
                    return NotFound();
                }

                _context.MateriasPrimas.Remove(materiaPrima);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Materia prima con ID: {id} eliminada exitosamente", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al eliminar materia prima con ID {id}: {ex.Message}");
                return StatusCode(500, "Error interno del servidor.");
            }
        }

        private bool MateriaPrimaExists(int id)
        {
            return _context.MateriasPrimas.Any(e => e.idMateriaPrima == id);
        }

        [HttpGet("ListarMateriasPrimas")]
        public async Task<ActionResult<IEnumerable<MateriaPrima>>> ListarMateriasPrimas()
        {
            try
            {
                _logger.LogInformation("Listando todas las materias primas");
                var materiasPrimas = await _context.MateriasPrimas.ToListAsync();
                _logger.LogInformation("Materias primas listadas exitosamente. Total: {total}", materiasPrimas.Count);
                return Ok(materiasPrimas);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al listar materias primas: {ex.Message}");
                return StatusCode(500, "Error interno del servidor.");
            }
        }
    }
}
