using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinalAPI.Dto;
using ProyectoFinalAPI.Models;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProyectoFinalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProveedoresController : ControllerBase
    {
        private readonly ProyectoContext _context;
        private readonly ILogger<ProveedoresController> _logger;

        public ProveedoresController(ProyectoContext context, ILogger<ProveedoresController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Proveedores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProveedorDTO>>> GetProveedores()
        {
            try
            {
                var proveedores = await _context.Proveedor
                    .Include(p => p.MateriasPrimas)
                    .ToListAsync();

                var proveedoresDto = proveedores.Select(p => new ProveedorDTO
                {
                    idProveedor = p.idProveedor,
                    nombreProveedor = p.nombreProveedor,
                    telefono = p.telefono,
                    correo = p.correo,
                    nombresMateriasPrimas = p.MateriasPrimas.Select(mp => mp.nombreMateriaPrima).ToList()
                }).ToList();

                return Ok(proveedoresDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al recuperar la lista de proveedores.");
                return StatusCode(500, "Ocurrió un error al recuperar los proveedores.");
            }
        }

        // GET: api/Proveedores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProveedorDTO>> GetProveedor(int id)
        {
            try
            {
                var proveedor = await _context.Proveedor
                    .Include(p => p.MateriasPrimas)
                    .FirstOrDefaultAsync(p => p.idProveedor == id);

                if (proveedor == null)
                {
                    return NotFound();
                }

                var proveedorDto = new ProveedorDTO
                {
                    idProveedor = proveedor.idProveedor,
                    nombreProveedor = proveedor.nombreProveedor,
                    telefono = proveedor.telefono,
                    correo = proveedor.correo,
                    nombresMateriasPrimas = proveedor.MateriasPrimas.Select(mp => mp.nombreMateriaPrima).ToList()
                };

                return Ok(proveedorDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al recuperar el proveedor con ID: {id}", id);
                return StatusCode(500, "Ocurrió un error al recuperar el proveedor.");
            }
        }

        // POST: api/Proveedores
        [HttpPost]
        public async Task<ActionResult<ProveedorDTO>> PostProveedor(Proveedor proveedor)
        {
            if (proveedor == null)
            {
                return BadRequest("Proveedor no puede ser nulo");
            }

            proveedor.MateriasPrimas = proveedor.MateriasPrimas ?? new List<MateriaPrima>();

            try
            {
                _context.Proveedor.Add(proveedor);
                await _context.SaveChangesAsync();

                var proveedorDto = new ProveedorDTO
                {
                    idProveedor = proveedor.idProveedor,
                    nombreProveedor = proveedor.nombreProveedor,
                    telefono = proveedor.telefono,
                    correo = proveedor.correo,
                    nombresMateriasPrimas = proveedor.MateriasPrimas.Select(mp => mp.nombreMateriaPrima).ToList()
                };

                return CreatedAtAction("GetProveedor", new { id = proveedor.idProveedor }, proveedorDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al guardar el proveedor.");
                return StatusCode(500, "Ocurrió un error al guardar el proveedor.");
            }
        }

        // DELETE: api/Proveedores/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProveedor(int id)
        {
            try
            {
                var proveedor = await _context.Proveedor
                    .Include(p => p.MateriasPrimas)
                    .FirstOrDefaultAsync(p => p.idProveedor == id);

                if (proveedor == null)
                {
                    return NotFound();
                }

                if (proveedor.MateriasPrimas != null && proveedor.MateriasPrimas.Count > 0)
                {
                    _context.MateriasPrimas.RemoveRange(proveedor.MateriasPrimas);
                }

                _context.Proveedor.Remove(proveedor);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar el proveedor con ID: {id}", id);
                return StatusCode(500, "Ocurrió un error al eliminar el proveedor.");
            }
        }

        // GET: api/Proveedores/{id}/materiasprimas
        [HttpGet("{id}/materiasprimas")]
        public async Task<ActionResult<IEnumerable<MateriaPrimaDTO>>> GetMateriasPrimasPorProveedor(int id)
        {
            try
            {
                var proveedor = await _context.Proveedor
                    .Include(p => p.MateriasPrimas)
                    .FirstOrDefaultAsync(p => p.idProveedor == id);

                if (proveedor == null)
                {
                    return NotFound("No se encontró el proveedor");
                }

                var materiasPrimasDto = proveedor.MateriasPrimas.Select(mp => new MateriaPrimaDTO
                {
                    NombreMateriaPrima = mp.nombreMateriaPrima,
                    Descripcion = mp.descripcion,
                    Precio = mp.precio,
                    Stock = mp.stock,
                    idUnidad = mp.idUnidad
                }).ToList();

                return Ok(materiasPrimasDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al recuperar materias primas del proveedor con ID: {id}", id);
                return StatusCode(500, "Ocurrió un error al recuperar las materias primas del proveedor.");
            }
        }

        private bool ProveedorExists(int id)
        {
            return _context.Proveedor.Any(e => e.idProveedor == id);
        }
    }
}
