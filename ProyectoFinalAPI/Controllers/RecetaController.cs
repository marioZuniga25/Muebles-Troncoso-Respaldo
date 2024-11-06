using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinalAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace ProyectoFinalAPI.Controllers
{
 [Route("api/[controller]")]
 [ApiController]
 public class RecetaController : ControllerBase
 {
  private readonly ProyectoContext _context;

  public RecetaController(ProyectoContext context)
  {
   _context = context;
  }

  [HttpGet("ListadoRecetas")]
  public async Task<ActionResult<IEnumerable<Receta>>> GetListadoRecetas()
  {
   var recetas = await _context.Recetas
       .Include(r => r.Producto)
       .Include(r => r.Detalles)
           .ThenInclude(d => d.MateriaPrima)
       .ToListAsync();

   if (recetas == null || recetas.Count == 0)
   {
    return NotFound("No se encontraron recetas");
   }

   return Ok(recetas);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<Receta>> GetRecetaById(int id)
  {
   var receta = await _context.Recetas
       .Include(r => r.Producto)
       .Include(r => r.Detalles)
           .ThenInclude(d => d.MateriaPrima)
       .FirstOrDefaultAsync(r => r.idReceta == id);

   if (receta == null)
   {
    return NotFound("Receta no encontrada");
   }

   return Ok(receta);
  }

  [HttpPost("Agregar")]
  public async Task<ActionResult> AgregarReceta([FromBody] RecetaDto request)
  {
   // Verificar si el producto existe
   var producto = await _context.Producto.FindAsync(request.IdProducto);
   if (producto == null)
   {
    return BadRequest("Producto no encontrado");
   }

   var detalles = new List<RecetaDetalle>();
   foreach (var detalleDto in request.Detalles)
   {
    // Verificar si la materia prima existe
    var materiaPrima = await _context.MateriasPrimas.FindAsync(detalleDto.IdMateriaPrima);
    if (materiaPrima == null)
    {
     return BadRequest($"Materia Prima con ID {detalleDto.IdMateriaPrima} no encontrada");
    }

    detalles.Add(new RecetaDetalle
    {
     // El ID se generará automáticamente
     idMateriaPrima = detalleDto.IdMateriaPrima,
     cantidad = detalleDto.Cantidad
    });
   }

   var newReceta = new Receta
   {
    idProducto = request.IdProducto,
    Detalles = detalles
   };

   await _context.Recetas.AddAsync(newReceta);
   await _context.SaveChangesAsync();

   return Ok(newReceta);
  }

  [HttpPut("Modificar/{id}")]
  public async Task<ActionResult> ModificarReceta(int id, [FromBody] RecetaDto request)
  {
   if (id != request.IdReceta)
   {
    return BadRequest("El ID de la receta no coincide");
   }

   var recetaModificar = await _context.Recetas
       .Include(r => r.Detalles)
       .FirstOrDefaultAsync(r => r.idReceta == id);

   if (recetaModificar == null)
   {
    return NotFound("Receta no encontrada");
   }

   // Actualizar el producto
   var producto = await _context.Producto.FindAsync(request.IdProducto);
   if (producto == null)
   {
    return BadRequest("Producto no encontrado");
   }
   recetaModificar.idProducto = request.IdProducto;

   // Eliminar los detalles existentes
   _context.RecetaDetalles.RemoveRange(recetaModificar.Detalles);

   // Agregar los nuevos detalles
   var nuevosDetalles = new List<RecetaDetalle>();
   foreach (var detalleDto in request.Detalles)
   {
    var materiaPrima = await _context.MateriasPrimas.FindAsync(detalleDto.IdMateriaPrima);
    if (materiaPrima == null)
    {
     return BadRequest($"Materia Prima con ID {detalleDto.IdMateriaPrima} no encontrada");
    }

    nuevosDetalles.Add(new RecetaDetalle
    {
     idMateriaPrima = detalleDto.IdMateriaPrima,
     cantidad = detalleDto.Cantidad,
     idReceta = id
    });
   }

   recetaModificar.Detalles = nuevosDetalles;

   await _context.SaveChangesAsync();

   return Ok(recetaModificar);
  }

  [HttpDelete("Eliminar/{id}")]
  public async Task<ActionResult> EliminarReceta(int id)
  {
   var recetaEliminar = await _context.Recetas
       .Include(r => r.Detalles)
       .FirstOrDefaultAsync(r => r.idReceta == id);

   if (recetaEliminar == null)
   {
    return NotFound(new { mensaje = "Receta no encontrada" });
   }

   // Eliminar los detalles asociados
   _context.RecetaDetalles.RemoveRange(recetaEliminar.Detalles);

   _context.Recetas.Remove(recetaEliminar);
   await _context.SaveChangesAsync();

   return Ok(new { mensaje = "Receta eliminada correctamente" });
  }

  [HttpPost("ProcesarReceta/{id}/{cantidad}")]
  public async Task<ActionResult> ProcesarReceta(int id, int cantidad)
  {
   // Obtener la receta por ID, incluyendo detalles y materia prima
   var receta = await _context.Recetas
       .Include(r => r.Detalles)
           .ThenInclude(d => d.MateriaPrima)
       .Include(r => r.Producto) // Incluir el producto asociado a la receta
       .FirstOrDefaultAsync(r => r.idReceta == id);

   if (receta == null)
   {
    return NotFound("Receta no encontrada");
   }

   // Validar que haya suficiente stock de materia prima para producir la cantidad solicitada
   foreach (var detalle in receta.Detalles)
   {
    var materiaPrima = detalle.MateriaPrima;
    var totalRequerido = detalle.cantidad * cantidad;

    if (materiaPrima.stock < totalRequerido)
    {
     return BadRequest($"Cantidad insuficiente en stock para la materia prima {materiaPrima.nombreMateriaPrima}. Cantidad disponible: {materiaPrima.stock}, Cantidad requerida: {totalRequerido}");
    }
   }

   // Si hay suficiente stock, proceder a descontar las cantidades
   foreach (var detalle in receta.Detalles)
   {
    var materiaPrima = detalle.MateriaPrima;
    materiaPrima.stock -= detalle.cantidad * cantidad;
   }

   // Actualizar el stock del producto
   var producto = receta.Producto;

   if (producto == null)
   {
    return BadRequest("Producto no encontrado para esta receta");
   }

   producto.stock += cantidad; // Aumenta el stock del producto por la cantidad producida

   // Guardar los cambios en la base de datos
   await _context.SaveChangesAsync();

   return Ok(new { mensaje = "Receta procesada y cantidades descontadas del stock correctamente" });
  }
 }
}
