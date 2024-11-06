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
    public class PedidoController : ControllerBase
    {
        private readonly ProyectoContext _context;
        private readonly ILogger<PedidoController> _logger;

        public PedidoController(ProyectoContext context, ILogger<PedidoController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Pedido
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PedidoDetalleDto>>> GetPedidos()
        {
            _logger.LogInformation("Consultando todos los pedidos.");
            var result = await (from pedido in _context.Pedidos
                                join detalleVenta in _context.DetalleVenta on pedido.idVenta equals detalleVenta.idVenta
                                join producto in _context.Producto on detalleVenta.idProducto equals producto.idProducto
                                select new
                                {
                                    pedido,
                                    detalleVenta,
                                    producto
                                })
                               .GroupBy(g => new
                               {
                                   g.pedido.idPedido,
                                   g.pedido.idVenta,
                                   g.pedido.nombre,
                                   g.pedido.apellidos,
                                   g.pedido.telefono,
                                   g.pedido.correo,
                                   g.pedido.calle,
                                   g.pedido.numero,
                                   g.pedido.colonia,
                                   g.pedido.ciudad,
                                   g.pedido.estado,
                                   g.pedido.codigoPostal,
                                   g.pedido.estatus
                               })
                               .Select(group => new PedidoDetalleDto
                               {
                                   idPedido = group.Key.idPedido,
                                   idVenta = group.Key.idVenta,
                                   nombre = group.Key.nombre,
                                   apellidos = group.Key.apellidos,
                                   telefono = group.Key.telefono,
                                   correo = group.Key.correo,
                                   calle = group.Key.calle,
                                   numero = group.Key.numero,
                                   colonia = group.Key.colonia,
                                   ciudad = group.Key.ciudad,
                                   estado = group.Key.estado,
                                   codigoPostal = group.Key.codigoPostal,
                                   estatus = group.Key.estatus,
                                   Productos = group.Select(item => new DetalleProducto
                                   {
                                       idProducto = item.producto.idProducto,
                                       nombreProducto = item.producto.nombreProducto,
                                       descripcion = item.producto.descripcion,
                                       precioUnitario = item.detalleVenta.precioUnitario,
                                       cantidad = item.detalleVenta.cantidad,
                                       imagen = item.producto.imagen
                                   }).ToList()
                               })
                               .ToListAsync();

            _logger.LogInformation("Se recuperaron {count} pedidos.", result.Count);
            return result;
        }

        // POST: api/Pedido
        [HttpPost]
        public async Task<ActionResult<Pedidos>> AddPedido(Pedidos pedido)
        {
            try
            {
                _logger.LogInformation("Agregando un nuevo pedido.");
                _context.Pedidos.Add(pedido);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Pedido creado con ID: {idPedido}.", pedido.idPedido);
                return CreatedAtAction(nameof(GetPedidos), new { id = pedido.idPedido }, pedido);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error al agregar el pedido: {errorMessage}", ex.Message);
                return StatusCode(500, "Error interno del servidor.");
            }
        }

        // PUT: api/Pedido/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePedido(int id, Pedidos pedido)
        {
            try
            {
                _logger.LogInformation("Actualizando el pedido con ID: {idPedido}.", id);

                if (id != pedido.idPedido)
                {
                    _logger.LogWarning("El ID proporcionado {id} no coincide con el ID del pedido {pedidoId}.", id, pedido.idPedido);
                    return BadRequest();
                }

                _context.Entry(pedido).State = EntityState.Modified;

                await _context.SaveChangesAsync();
                _logger.LogInformation("Pedido con ID: {idPedido} actualizado correctamente.", id);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Pedidos.Any(e => e.idPedido == id))
                {
                    _logger.LogWarning("No se encontró el pedido con ID: {idPedido} para actualizar.", id);
                    return NotFound();
                }
                else
                {
                    _logger.LogError("Error de concurrencia al actualizar el pedido con ID: {idPedido}.", id);
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error al actualizar el pedido: {errorMessage}", ex.Message);
                return StatusCode(500, "Error interno del servidor.");
            }

            return NoContent();
        }
    }
}
