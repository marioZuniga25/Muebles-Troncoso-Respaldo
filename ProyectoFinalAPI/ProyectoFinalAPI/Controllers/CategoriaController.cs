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
            _logger.LogInformation("Consultando todas las categorías"); // Log para la consulta inicial

            try
            {
                return await _context.Categorias.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ocurrió un error al consultar todas las categorías");
                return StatusCode(500, "Ocurrió un error al consultar las categorías.");
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
                    _logger.LogWarning("Categoría con ID {id} no encontrada", id);
                    return NotFound();
                }

                return categoria;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ocurrió un error al consultar la categoría con ID: {id}", id);
                return StatusCode(500, "Ocurrió un error al consultar la categoría.");
            }
        }

        // POST: api/Categorias
        [HttpPost]
        public async Task<ActionResult<Categoria>> PostCategoria(Categoria categoria)
        {
            if (categoria == null)
            {
                _logger.LogWarning("Se recibió una categoría nula para creación");
                return BadRequest("La categoría no puede ser nula");
            }

            try
            {
                _context.Categorias.Add(categoria);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetCategoria", new { id = categoria.idCategoria }, categoria);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ocurrió un error al crear una nueva categoría");
                return StatusCode(500, "Ocurrió un error al crear la categoría.");
            }
        }

        // PUT: api/Categorias/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoria(int id, Categoria categoria)
        {
            if (id != categoria.idCategoria)
            {
                _logger.LogWarning("ID de categoría en la solicitud no coincide. Esperado: {id}, Recibido: {categoriaId}", id, categoria.idCategoria);
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
                    _logger.LogWarning("Categoría con ID {id} no encontrada durante la actualización", id);
                    return NotFound();
                }
                else
                {
                    _logger.LogError(ex, "Ocurrió un error de concurrencia al actualizar la categoría con ID: {id}", id);
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ocurrió un error al actualizar la categoría con ID: {id}", id);
                return StatusCode(500, "Ocurrió un error al actualizar la categoría.");
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
                    _logger.LogWarning("Categoría con ID {id} no encontrada durante la eliminación", id);
                    return NotFound();
                }

                _context.Categorias.Remove(categoria);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ocurrió un error al eliminar la categoría con ID: {id}", id);
                return StatusCode(500, "Ocurrió un error al eliminar la categoría.");
            }
        }

        private bool CategoriaExists(int id)
        {
            return _context.Categorias.Any(e => e.idCategoria == id);
        }
    }
}
