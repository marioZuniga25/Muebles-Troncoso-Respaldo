using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinalAPI.Models;

namespace ProyectoFinalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductoController : ControllerBase
    {

        private readonly ProyectoContext _context;
        public ProductoController(ProyectoContext context)
        {
            _context = context;
        }

        [HttpGet("ListadoProductos")]
        public async Task<ActionResult<IEnumerable<ProductoDto>>> GetListadoProductos()
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

            return Ok(productos);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProductoById(int id)
        {
            var producto = await _context.Producto.FindAsync(id);

            if (producto == null)
            {
                return NotFound();
            }

            return producto;
        }


        [HttpPost("Agregar")]
        public async Task<ActionResult> AgregarProducto([FromBody] Producto request)
        {
            try
            {
                if (request.idCategoria <= 0)
                {
                    return BadRequest("El idCategoria es requerido y debe ser mayor a 0.");
                }

                var categoria = await _context.Categorias.FirstOrDefaultAsync(c => c.idCategoria == request.idCategoria);

                if (categoria == null)
                {
                    return NotFound("Categoría no encontrada.");
                }

                request.NombreCategoria = categoria.nombreCategoria;

                ModelState.Clear();

                await _context.Producto.AddAsync(request);
                await _context.SaveChangesAsync();

                return Ok(request);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al agregar el producto: {ex.Message}");
                Console.WriteLine(ex.StackTrace);

                return StatusCode(500, "Ocurrió un error al agregar el producto.");
            }
        }



        [HttpPost("Modificar/{id}")]
        public async Task<ActionResult> ModificarProducto(int id, [FromBody] Producto request)
        {
            var productoModificar = await _context.Producto.FindAsync(id);

            if (productoModificar == null)
            {
                return BadRequest("Producto no encontrado");
            }

            if (request.idCategoria <= 0)
            {
                return BadRequest("El idCategoria es requerido y debe ser mayor a 0.");
            }

            var categoria = await _context.Categorias.FirstOrDefaultAsync(c => c.idCategoria == request.idCategoria);

            if (categoria == null)
            {
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

            return Ok(productoModificar);
        }


        [HttpGet("FiltrarProductos")]
        public async Task<ActionResult<IEnumerable<ProductoDto>>> FiltrarProductos([FromQuery] string term = null)
        {
            if (string.IsNullOrWhiteSpace(term))
            {
                var productos = await _context.Producto
                    .Join(_context.Categorias,
                          producto => producto.idCategoria,
                          categoria => categoria.idCategoria,
                          (producto, categoria) => new ProductoDto
                          {
                              IdProducto = producto.idProducto,
                              NombreProducto = producto.nombreProducto,
                              Descripcion = producto.descripcion,
                              Precio = producto.precio,
                              Stock = producto.stock,
                              NombreCategoria = categoria.nombreCategoria,
                              IdInventario = producto.idInventario,
                              Imagen = producto.imagen
                          })
                    .ToListAsync();

                return Ok(productos);
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

            return Ok(filteredProductos);
        }

        [HttpDelete("Eliminar/{id}")]
        public async Task<ActionResult> EliminarProducto(int id)
        {
            var producto = await _context.Producto.FindAsync(id);

            if (producto == null)
            {
                return NotFound(new { mensaje = "Producto no encontrado" });
            }

            _context.Producto.Remove(producto);
            await _context.SaveChangesAsync();

        return Ok(new { mensaje = "Producto eliminado correctamente" });        
        }

        [HttpGet("ProductoPorCategoria/{idCategoria}")]
        public async Task<ActionResult<IEnumerable<ProductoDto>>> GetProductosPorCategoria(int idCategoria)
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
                return NotFound();
            }

            return productos;
        }
        [HttpGet("ValidarStock/{id}")]
            public async Task<ActionResult> ValidarStock(int id)
            {
                var producto = await _context.Producto.FindAsync(id);

                if (producto == null)
                {
                    return NotFound(new { mensaje = "Producto no encontrado" });
                }

                if (producto.stock > 0)
                {
                    return Ok(new { mensaje = "1"});
                }
                else
                {
                   return Ok(new { mensaje = "0"});
                }
            }
    }
}
