using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinalAPI.Models;
using Microsoft.Extensions.Logging; // Asegúrate de incluir esta directiva
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProyectoFinalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VentasController : ControllerBase
    {
        private readonly ProyectoContext _context;
        private readonly ILogger<VentasController> _logger; // Agregar logger

        public VentasController(ProyectoContext context, ILogger<VentasController> logger)
        {
            _context = context;
            _logger = logger; // Inicializar logger
        }

        [HttpPost("AgregarVentaOnline")]
        public async Task<ActionResult> AddVentaOnline([FromBody] Venta request)
        {
            try
            {
                request.tipoVenta = "Online";
                await _context.Venta.AddAsync(request);
                await _context.SaveChangesAsync();
                int idVentaGenerado = request.idVenta;

                return Ok(idVentaGenerado);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al agregar venta online.");
                return StatusCode(500, "Error interno del servidor.");
            }
        }

        [HttpPost("AgregarVentaFisica")]
        public async Task<ActionResult> AddVentaFisica([FromBody] Venta request)
        {
            try
            {
                request.tipoVenta = "Fisica";
                await _context.Venta.AddAsync(request);
                await _context.SaveChangesAsync();
                int idVentaGenerado = request.idVenta;

                return Ok(idVentaGenerado);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al agregar venta física.");
                return StatusCode(500, "Error interno del servidor.");
            }
        }

        [HttpPost("AgregarDetalleVenta")]
        public async Task<ActionResult> AddDetallesVenta([FromBody] List<DetalleVenta> detallesVenta)
        {
            try
            {
                foreach (var detalle in detallesVenta)
                {
                    // Buscar el producto
                    var producto = await _context.Producto
                        .FirstOrDefaultAsync(p => p.idProducto == detalle.idProducto);

                    if (producto == null)
                    {
                        return NotFound($"El producto con ID {detalle.idProducto} no se encontró.");
                    }

                    if (producto.stock < detalle.cantidad)
                    {
                        return BadRequest($"No hay suficiente stock del producto '{producto.nombreProducto}'. Stock disponible: {producto.stock}");
                    }

                    producto.stock -= detalle.cantidad;

                    _context.DetalleVenta.Add(detalle);
                }

                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al agregar detalles de la venta.");
                return StatusCode(500, "Error interno del servidor.");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Venta>> GetVentaById(int id)
        {
            try
            {
                var venta = await _context.Venta.FindAsync(id);
                if (venta == null)
                {
                    return NotFound();
                }
                return venta;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener la venta con ID: {Id}.", id);
                return StatusCode(500, "Error interno del servidor.");
            }
        }

        // Nuevo Endpoint para obtener los detalles de una venta por ID de la venta
        [HttpGet("{id}/detalles")]
        public async Task<ActionResult<IEnumerable<DetalleVenta>>> GetDetalleVentaByVentaId(int id)
        {
            try
            {
                var detallesVenta = await _context.DetalleVenta
                    .Where(dv => dv.idVenta == id)
                    .ToListAsync();

                if (detallesVenta == null || !detallesVenta.Any())
                {
                    return NotFound();
                }

                return detallesVenta;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener detalles de la venta con ID: {Id}.", id);
                return StatusCode(500, "Error interno del servidor.");
            }
        }
    }
}
