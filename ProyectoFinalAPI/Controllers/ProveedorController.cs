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
    public class ProveedoresController : ControllerBase
    {
        private readonly ProyectoContext _context;

        public ProveedoresController(ProyectoContext context)
        {
            _context = context;
        }

        // GET: api/Proveedores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProveedorDTO>>> GetProveedores()
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

        // GET: api/Proveedores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProveedorDTO>> GetProveedor(int id)
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

        // POST: api/Proveedores
        [HttpPost]
        public async Task<ActionResult<ProveedorDTO>> PostProveedor(Proveedor proveedor)
        {
            if (proveedor == null)
            {
                return BadRequest("Proveedor no puede ser nulo");
            }

            proveedor.MateriasPrimas = proveedor.MateriasPrimas ?? new List<MateriaPrima>();

            _context.Proveedor.Add(proveedor);
            await _context.SaveChangesAsync();

            if (proveedor.MateriasPrimas.Any())
            {
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    return BadRequest($"Error al guardar: {ex.Message}");
                }
            }

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

        // DELETE: api/Proveedores/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProveedor(int id)
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

        // GET: api/Proveedores/{id}/materiasprimas
        [HttpGet("{id}/materiasprimas")]
        public async Task<ActionResult<IEnumerable<MateriaPrimaDTO>>> GetMateriasPrimasPorProveedor(int id)
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

        private bool ProveedorExists(int id)
        {
            return _context.Proveedor.Any(e => e.idProveedor == id);
        }
    }
}
