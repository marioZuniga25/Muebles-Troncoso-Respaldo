using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinalAPI.Models;
using Serilog;

namespace ProyectoFinalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ProyectoContext _context;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(ProyectoContext context, ILogger<DashboardController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("ventas-totales")]
        public async Task<IActionResult> GetTotalVentas(string fechaInicio = "", string fechaFin = "")
        {
            DateTime inicio;
            DateTime fin;

            if (string.IsNullOrEmpty(fechaInicio))
            {
                inicio = DateTime.Now.AddDays(-7).Date; // Solo la fecha, sin hora
            }
            else
            {
                inicio = DateTime.Parse(fechaInicio).Date; // Solo la fecha, sin hora
            }

            if (string.IsNullOrEmpty(fechaFin))
            {
                fin = DateTime.Today; // Solo la fecha, sin hora
            }
            else
            {
                fin = DateTime.Parse(fechaFin).Date; // Solo la fecha, sin hora
            }

            try
            {
                _logger.LogInformation("Consultando ventas totales desde {inicio} hasta {fin}", inicio, fin);

                var ventasOnline = await _context.Venta
                    .Where(v => v.tipoVenta == "Online" && v.fechaVenta >= inicio && v.fechaVenta <= fin.AddDays(1).AddTicks(-1))
                    .SumAsync(v => v.total);

                var ventasFisico = await _context.Venta
                    .Where(v => v.tipoVenta == "Fisica" && v.fechaVenta >= inicio && v.fechaVenta <= fin.AddDays(1).AddTicks(-1))
                    .SumAsync(v => v.total);

                _logger.LogInformation("Ventas totales calculadas: Online = {ventasOnline}, Fisica = {ventasFisico}", ventasOnline, ventasFisico);
                return Ok(new { ventasOnline, ventasFisico });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al consultar ventas totales: {ex.Message}");
                return StatusCode(500, "Error interno del servidor.");
            }
        }

        [HttpGet("productos-mas-vendidos")]
        public async Task<IActionResult> GetProductosMasVendidos()
        {
            try
            {
                _logger.LogInformation("Consultando productos más vendidos");
                var productosMasVendidos = await _context.DetalleVenta
                    .GroupBy(dv => dv.idProducto)
                    .Select(g => new
                    {
                        ProductoId = g.Key,
                        TotalVendidos = g.Sum(dv => dv.cantidad)
                    })
                    .OrderByDescending(g => g.TotalVendidos)
                    .Take(5)
                    .ToListAsync();

                var productosInfo = await _context.Producto
                    .Where(p => productosMasVendidos.Select(pm => pm.ProductoId).Contains(p.idProducto))
                    .Select(p => new
                    {
                        p.idProducto,
                        p.nombreProducto
                    })
                    .ToListAsync();

                var result = productosMasVendidos.Join(productosInfo,
                    pm => pm.ProductoId,
                    pi => pi.idProducto,
                    (pm, pi) => new
                    {
                        pi.nombreProducto,
                        pm.TotalVendidos
                    });

                _logger.LogInformation("Productos más vendidos consultados con éxito");
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al consultar productos más vendidos: {ex.Message}");
                return StatusCode(500, "Error interno del servidor.");
            }
        }

        [HttpGet("usuarios-activos")]
        public async Task<IActionResult> GetUsuariosActivos()
        {
            try
            {
                _logger.LogInformation("Consultando número de usuarios activos");
                var usuariosActivos = await _context.Usuario.CountAsync();
                return Ok(new { UsuariosActivos = usuariosActivos });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al consultar usuarios activos: {ex.Message}");
                return StatusCode(500, "Error interno del servidor.");
            }
        }

        [HttpGet("productos-por-categoria")]
        public async Task<IActionResult> GetProductosPorCategoria()
        {
            try
            {
                _logger.LogInformation("Consultando productos por categoría");
                var productosPorCategoria = await _context.Producto
                    .GroupBy(p => p.idCategoria)
                    .Select(g => new
                    {
                        CategoriaId = g.Key,
                        TotalProductos = g.Count()
                    })
                    .ToListAsync();

                var categoriasInfo = await _context.Categorias
                    .Where(c => productosPorCategoria.Select(pc => pc.CategoriaId).Contains(c.idCategoria))
                    .Select(c => new
                    {
                        c.idCategoria,
                        c.nombreCategoria
                    })
                    .ToListAsync();

                var result = productosPorCategoria.Join(categoriasInfo,
                    pc => pc.CategoriaId,
                    ci => ci.idCategoria,
                    (pc, ci) => new
                    {
                        ci.nombreCategoria,
                        pc.TotalProductos
                    });

                _logger.LogInformation("Productos por categoría consultados con éxito");
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al consultar productos por categoría: {ex.Message}");
                return StatusCode(500, "Error interno del servidor.");
            }
        }
    }
}
