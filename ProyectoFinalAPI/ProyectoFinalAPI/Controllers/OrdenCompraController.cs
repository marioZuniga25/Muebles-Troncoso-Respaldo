using Microsoft.AspNetCore.Mvc;
using ProyectoFinalAPI.Models;
using ProyectoFinalAPI;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class OrdenCompraController : ControllerBase
{
    private readonly ProyectoContext _context;
    private readonly ILogger<OrdenCompraController> _logger;

    public OrdenCompraController(ProyectoContext context, ILogger<OrdenCompraController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // POST: api/OrdenCompra/CrearOrdenCompra
    [HttpPost("CrearOrdenCompra")]
    public async Task<ActionResult> CrearOrdenCompra([FromBody] OrdenCompra request)
    {
        try
        {
            _logger.LogInformation("Iniciando la creación de una nueva orden de compra.");

            // Validar que el proveedor existe
            if (request.idProveedor <= 0)
            {
                _logger.LogWarning("El proveedor es requerido pero no fue proporcionado.");
                return BadRequest("El proveedor es requerido.");
            }

            var proveedor = await _context.Proveedor.FindAsync(request.idProveedor);
            if (proveedor == null)
            {
                _logger.LogWarning("El proveedor con ID {idProveedor} no existe.", request.idProveedor);
                return BadRequest("El proveedor no existe.");
            }

            // Validar que la orden de compra tiene detalles
            if (request.Detalles == null || !request.Detalles.Any())
            {
                _logger.LogWarning("La orden de compra no tiene detalles.");
                return BadRequest("La orden de compra debe tener al menos un detalle.");
            }

            // Crear la orden de compra
            OrdenCompra nuevaOrden = new OrdenCompra
            {
                idProveedor = request.idProveedor,
                fechaCompra = DateTime.Now,
                Detalles = new List<DetalleOrdenCompra>(),
                usuario = request.usuario
            };

            // Procesar cada detalle
            foreach (var detalleRequest in request.Detalles)
            {
                var materiaPrima = await _context.MateriasPrimas.FindAsync(detalleRequest.idMateriaPrima);
                if (materiaPrima == null)
                {
                    _logger.LogWarning("La materia prima con ID {idMateriaPrima} no existe.", detalleRequest.idMateriaPrima);
                    return BadRequest($"La materia prima con ID {detalleRequest.idMateriaPrima} no existe.");
                }

                // Crear el detalle de la orden
                var detalleOrden = new DetalleOrdenCompra
                {
                    idMateriaPrima = detalleRequest.idMateriaPrima,
                    cantidad = detalleRequest.cantidad,
                    precioUnitario = materiaPrima.precio
                };

                // Actualizar el stock de la materia prima
                materiaPrima.stock += detalleRequest.cantidad; // Sumar la cantidad comprada al stock actual

                // Agregar el detalle a la orden
                nuevaOrden.Detalles.Add(detalleOrden);
            }

            // Guardar la orden de compra
            await _context.OrdenesCompra.AddAsync(nuevaOrden);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Orden de compra creada exitosamente con ID: {idOrdenCompra}", nuevaOrden.idOrdenCompra);
            return Ok(nuevaOrden);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error al crear la orden de compra: {ex.Message}");
            return StatusCode(500, "Error interno del servidor.");
        }
    }

    // GET: api/OrdenCompra/ListadoOrdenes
    [HttpGet("ListadoOrdenes")]
    public async Task<ActionResult<IEnumerable<object>>> GetListadoOrdenesCompra()
    {
        try
        {
            _logger.LogInformation("Consultando el listado de órdenes de compra.");
            var ordenesCompra = await _context.OrdenesCompra
                .Include(o => o.Detalles) // Incluye los detalles de la orden
                .ToListAsync();

            var result = new List<object>();

            foreach (var orden in ordenesCompra)
            {
                // Obtener el nombre del proveedor usando el idProveedor
                var proveedor = await _context.Proveedor.FindAsync(orden.idProveedor);

                result.Add(new
                {
                    orden.idOrdenCompra,
                    orden.idProveedor,
                    NombreProveedor = proveedor?.nombreProveedor ?? "No asignado", // Nombre del proveedor
                    orden.fechaCompra,
                    orden.usuario,
                    Detalles = orden.Detalles
                });
            }

            _logger.LogInformation("Listado de órdenes de compra consultado exitosamente. Total: {total}", ordenesCompra.Count);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error al consultar el listado de órdenes de compra: {ex.Message}");
            return StatusCode(500, "Error interno del servidor.");
        }
    }
}
