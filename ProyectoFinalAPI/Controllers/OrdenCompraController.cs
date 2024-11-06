using Microsoft.AspNetCore.Mvc;
using ProyectoFinalAPI.Models;
using ProyectoFinalAPI;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class OrdenCompraController : ControllerBase
{
 private readonly ProyectoContext _context;

 public OrdenCompraController(ProyectoContext context)
 {
  _context = context;
 }

 // POST: api/OrdenCompra/CrearOrdenCompra
 [HttpPost("CrearOrdenCompra")]
 public async Task<ActionResult> CrearOrdenCompra([FromBody] OrdenCompra request)
 {
  // Validar que el proveedor existe
  if (request.idProveedor <= 0)
  {
   return BadRequest("El proveedor es requerido.");
  }

  var proveedor = await _context.Proveedor.FindAsync(request.idProveedor);
  if (proveedor == null)
  {
   return BadRequest("El proveedor no existe.");
  }

  // Validar que la orden de compra tiene detalles
  if (request.Detalles == null || !request.Detalles.Any())
  {
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

  return Ok(nuevaOrden);
 }



 // GET: api/OrdenCompra/ListadoOrdenes
 // GET: api/OrdenCompra/ListadoOrdenes
 [HttpGet("ListadoOrdenes")]
 public async Task<ActionResult<IEnumerable<object>>> GetListadoOrdenesCompra()
 {
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

  return Ok(result);
 }
}