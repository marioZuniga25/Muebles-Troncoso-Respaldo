using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinalAPI.Models;
using Serilog;

namespace ProyectoFinalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly ProyectoContext _context;
        private readonly ILogger<CategoriasController> _logger;

        public CategoriasController(ProyectoContext context, ILogger<CategoriasController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Categorias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
        {
            _logger.LogInformation("Consultando todas las categor�as"); // Log para la consulta inicial

            try
            {
                return await _context.Categorias.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ocurri� un error al consultar todas las categor�as");
                return StatusCode(500, "Ocurri� un error al consultar las categor�as.");
            }
        }

        // GET: api/Categorias/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> GetCategoria(int id)
        {
            try
            {
                var categoria = await _context.Categorias.FindAsync(id);

                if (categoria == null)
                {
                    _logger.LogWarning("Categor�a con ID {id} no encontrada", id);
                    return NotFound();
                }

                return categoria;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ocurri� un error al consultar la categor�a con ID: {id}", id);
                return StatusCode(500, "Ocurri� un error al consultar la categor�a.");
            }
        }

        // POST: api/Categorias
        [HttpPost]
        public async Task<ActionResult<Categoria>> PostCategoria(Categoria categoria)
        {
            if (categoria == null)
            {
                _logger.LogWarning("Se recibi� una categor�a nula para creaci�n");
                return BadRequest("La categor�a no puede ser nula");
            }

            try
            {
                _context.Categorias.Add(categoria);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetCategoria", new { id = categoria.idCategoria }, categoria);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ocurri� un error al crear una nueva categor�a");
                return StatusCode(500, "Ocurri� un error al crear la categor�a.");
            }
        }

        // PUT: api/Categorias/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoria(int id, Categoria categoria)
        {
            if (id != categoria.idCategoria)
            {
                _logger.LogWarning("ID de categor�a en la solicitud no coincide. Esperado: {id}, Recibido: {categoriaId}", id, categoria.idCategoria);
                return BadRequest();
            }

            _context.Entry(categoria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!CategoriaExists(id))
                {
                    _logger.LogWarning("Categor�a con ID {id} no encontrada durante la actualizaci�n", id);
                    return NotFound();
                }
                else
                {
                    _logger.LogError(ex, "Ocurri� un error de concurrencia al actualizar la categor�a con ID: {id}", id);
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ocurri� un error al actualizar la categor�a con ID: {id}", id);
                return StatusCode(500, "Ocurri� un error al actualizar la categor�a.");
            }

            return NoContent();
        }

        // DELETE: api/Categorias/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            try
            {
                var categoria = await _context.Categorias.FindAsync(id);
                if (categoria == null)
                {
                    _logger.LogWarning("Categor�a con ID {id} no encontrada durante la eliminaci�n", id);
                    return NotFound();
                }

                _context.Categorias.Remove(categoria);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ocurri� un error al eliminar la categor�a con ID: {id}", id);
                return StatusCode(500, "Ocurri� un error al eliminar la categor�a.");
            }
        }

        private bool CategoriaExists(int id)
        {
            return _context.Categorias.Any(e => e.idCategoria == id);
        }
    }
}
