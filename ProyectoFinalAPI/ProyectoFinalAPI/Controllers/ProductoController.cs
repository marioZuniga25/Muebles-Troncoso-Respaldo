using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinalAPI.Models;
using Serilog;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProyectoFinalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductoController : ControllerBase
    {
        private readonly ProyectoContext _context;
        private readonly ILogger<ProductoController> _logger;

        public ProductoController(ProyectoContext context, ILogger<ProductoController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Producto/ListadoProductos
        [HttpGet("ListadoProductos")]
        public async Task<ActionResult<IEnumerable<ProductoDto>>> GetListadoProductos()
        {
            _logger.LogInformation("Consultando listado de productos.");
            try
            {
                var productos = await _context.Producto
                    .Join(_context.Categorias,
                        producto => producto.idCategoria,
                        categoria => categoria.idCategoria,
                        (producto, categoria) => new ProductoDto
                        {
                            IdProducto = producto.idProducto,
                            IdCategoria = producto.idCategoria,
                            NombreProducto = producto.nombreProducto,
                            Descripcion = producto.descripcion,
                            Precio = producto.precio,
                            Stock = producto.stock,
                            NombreCategoria = categoria.nombreCategoria,
                            IdInventario = producto.idInventario,
                            Imagen = producto.imagen
                        })
                    .ToListAsync();

                _logger.LogInformation("Se recuperaron {count} productos.", productos.Count);
                return Ok(productos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al consultar listado de productos.");
                return StatusCode(500, "Ocurrió un error al consultar los productos.");
            }
        }

        // GET: api/Producto/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProductoById(int id)
        {
            _logger.LogInformation("Consultando producto con ID: {idProducto}.", id);
            try
            {
                var producto = await _context.Producto.FindAsync(id);

                if (producto == null)
                {
                    _logger.LogWarning("Producto con ID: {idProducto} no encontrado.", id);
                    return NotFound();
                }

                return producto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al consultar producto con ID: {idProducto}.", id);
                return StatusCode(500, "Ocurrió un error al consultar el producto.");
            }
        }

        // POST: api/Producto/Agregar
        [HttpPost("Agregar")]
        public async Task<ActionResult> AgregarProducto([FromBody] Producto request)
        {
            _logger.LogInformation("Agregando nuevo producto.");
            try
            {
                if (request.idCategoria <= 0)
                {
                    _logger.LogWarning("El idCategoria es requerido y debe ser mayor a 0.");
                    return BadRequest("El idCategoria es requerido y debe ser mayor a 0.");
                }

                var categoria = await _context.Categorias.FirstOrDefaultAsync(c => c.idCategoria == request.idCategoria);

                if (categoria == null)
                {
                    _logger.LogWarning("Categoría no encontrada para ID: {idCategoria}.", request.idCategoria);
                    return NotFound("Categoría no encontrada.");
                }

                request.NombreCategoria = categoria.nombreCategoria;

                await _context.Producto.AddAsync(request);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Producto creado con ID: {idProducto}.", request.idProducto);
                return Ok(request);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al agregar el producto: {errorMessage}", ex.Message);
                return StatusCode(500, "Ocurrió un error al agregar el producto.");
            }
        }

        // POST: api/Producto/Modificar/{id}
        [HttpPost("Modificar/{id}")]
        public async Task<ActionResult> ModificarProducto(int id, [FromBody] Producto request)
        {
            _logger.LogInformation("Modificando producto con ID: {idProducto}.", id);
            try
            {
                var productoModificar = await _context.Producto.FindAsync(id);

                if (productoModificar == null)
                {
                    _logger.LogWarning("Producto con ID: {idProducto} no encontrado para modificar.", id);
                    return BadRequest("Producto no encontrado");
                }

                if (request.idCategoria <= 0)
                {
                    _logger.LogWarning("El idCategoria es requerido y debe ser mayor a 0.");
                    return BadRequest("El idCategoria es requerido y debe ser mayor a 0.");
                }

                var categoria = await _context.Categorias.FirstOrDefaultAsync(c => c.idCategoria == request.idCategoria);

                if (categoria == null)
                {
                    _logger.LogWarning("Categoría no encontrada para ID: {idCategoria}.", request.idCategoria);
                    return NotFound("Categoría no encontrada.");
                }

                productoModificar.nombreProducto = request.nombreProducto;
                productoModificar.descripcion = request.descripcion;
                productoModificar.precio = request.precio;
                productoModificar.stock = request.stock;
                productoModificar.idInventario = request.idInventario;
                productoModificar.idCategoria = request.idCategoria;
                productoModificar.imagen = request.imagen;
                productoModificar.NombreCategoria = categoria.nombreCategoria;

                await _context.SaveChangesAsync();
                _logger.LogInformation("Producto con ID: {idProducto} modificado correctamente.", id);
                return Ok(productoModificar);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al modificar producto con ID: {idProducto}.", id);
                return StatusCode(500, "Ocurrió un error al modificar el producto.");
            }
        }

        // GET: api/Producto/FiltrarProductos
        [HttpGet("FiltrarProductos")]
        public async Task<ActionResult<IEnumerable<ProductoDto>>> FiltrarProductos([FromQuery] string term = null)
        {
            _logger.LogInformation("Filtrando productos con término: {searchTerm}.", term);
            try
            {
                if (string.IsNullOrWhiteSpace(term))
                {
                    return await GetListadoProductos();
                }

                var searchTerm = term.ToLower();

                var filteredProductos = await _context.Producto
                    .Join(_context.Categorias,
                          producto => producto.idCategoria,
                          categoria => categoria.idCategoria,
                          (producto, categoria) => new { producto, categoria })
                    .Where(pc => pc.producto.nombreProducto.ToLower().Contains(searchTerm) ||
                                 pc.producto.idProducto.ToString().Contains(searchTerm))
                    .Select(pc => new ProductoDto
                    {
                        IdProducto = pc.producto.idProducto,
                        NombreProducto = pc.producto.nombreProducto,
                        Descripcion = pc.producto.descripcion,
                        Precio = pc.producto.precio,
                        Stock = pc.producto.stock,
                        NombreCategoria = pc.categoria.nombreCategoria,
                        IdInventario = pc.producto.idInventario,
                        Imagen = pc.producto.imagen
                    })
                    .ToListAsync();

                _logger.LogInformation("Se encontraron {count} productos que coinciden con el término de búsqueda.", filteredProductos.Count);
                return Ok(filteredProductos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al filtrar productos.");
                return StatusCode(500, "Ocurrió un error al filtrar los productos.");
            }
        }

        // DELETE: api/Producto/Eliminar/{id}
        [HttpDelete("Eliminar/{id}")]
        public async Task<ActionResult> EliminarProducto(int id)
        {
            _logger.LogInformation("Eliminando producto con ID: {idProducto}.", id);
            try
            {
                var producto = await _context.Producto.FindAsync(id);

                if (producto == null)
                {
                    _logger.LogWarning("Producto con ID: {idProducto} no encontrado para eliminar.", id);
                    return NotFound(new { mensaje = "Producto no encontrado" });
                }

                _context.Producto.Remove(producto);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Producto con ID: {idProducto} eliminado correctamente.", id);
                return Ok(new { mensaje = "Producto eliminado correctamente" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar producto con ID: {idProducto}.", id);
                return StatusCode(500, "Ocurrió un error al eliminar el producto.");
            }
        }

        // GET: api/Producto/ProductoPorCategoria/{idCategoria}
        [HttpGet("ProductoPorCategoria/{idCategoria}")]
        public async Task<ActionResult<IEnumerable<ProductoDto>>> GetProductosPorCategoria(int idCategoria)
        {
            _logger.LogInformation("Consultando productos por categoría con ID: {idCategoria}.", idCategoria);
            try
            {
                var productos = await (from p in _context.Producto
                                       join c in _context.Categorias on p.idCategoria equals c.idCategoria
                                       where p.idCategoria == idCategoria
                                       select new ProductoDto
                                       {
                                           IdProducto = p.idProducto,
                                           NombreProducto = p.nombreProducto,
                                           Descripcion = p.descripcion,
                                           Precio = p.precio,
                                           Stock = p.stock,
                                           IdInventario = p.idInventario,
                                           Imagen = p.imagen,
                                           NombreCategoria = c.nombreCategoria,
                                           IdCategoria = p.idCategoria
                                       }).ToListAsync();

                if (productos == null || productos.Count == 0)
                {
                    _logger.LogWarning("No se encontraron productos para la categoría ID: {idCategoria}.", idCategoria);
                    return NotFound(new { mensaje = "No se encontraron productos para esta categoría." });
                }

                _logger.LogInformation("Se recuperaron {count} productos para la categoría ID: {idCategoria}.", productos.Count, idCategoria);
                return Ok(productos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al consultar productos por categoría con ID: {idCategoria}.", idCategoria);
                return StatusCode(500, "Ocurrió un error al consultar los productos por categoría.");
            }
        }
    }
}
