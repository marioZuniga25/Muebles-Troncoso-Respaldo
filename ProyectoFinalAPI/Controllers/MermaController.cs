using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinalAPI.Dto;
using ProyectoFinalAPI.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ProyectoFinalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MermaController : ControllerBase
    {
        private readonly ProyectoContext _context;

        public MermaController(ProyectoContext context)
        {
            _context = context;
        }




        [HttpGet("listaMermas")]
        public async Task<ActionResult<IEnumerable<Merma>>> GetMermas()
        {
            
            var fechaLimite = DateTime.Now.AddDays(-7);

            
            var mermaContext = await _context.Merma
                .Where(m => m.fechaMerma >= fechaLimite) 
                .ToListAsync();

            // Convertimos cada entidad Merma a MermaDTO
            var mermas = mermaContext.Select(m => new Merma
            {
                IdMerma = m.IdMerma,
                Nombre = m.Nombre,
                fechaMerma = m.fechaMerma,
                cantidad = m.cantidad,
                unidadMedida = m.unidadMedida,
                causa = m.causa,
                comentarios = m.comentarios,
                idUsuario = m.idUsuario,
                idMateria = m.idMateria
            }).ToList();

            return Ok(mermas);
        }


        [HttpGet("filtrarMermas")]
        public async Task<ActionResult<IEnumerable<Merma>>> FiltrarMermas(DateTime fechaInicio, DateTime fechaFin)
        {
            
            if (fechaInicio > fechaFin)
            {
                return BadRequest("La fecha de inicio no puede ser mayor que la fecha de fin.");
            }
            fechaFin = fechaFin.AddDays(1).AddTicks(-1);

            var mermaContext = await _context.Merma
                .Where(m => m.fechaMerma >= fechaInicio && m.fechaMerma <= fechaFin)
                .ToListAsync();

            var mermasFiltradas = mermaContext.Select(m => new Merma
            {
                IdMerma = m.IdMerma,
                Nombre = m.Nombre,
                fechaMerma = m.fechaMerma,
                idMateria = m.idMateria,
                cantidad = m.cantidad,
                unidadMedida = m.unidadMedida,
                causa = m.causa,
                comentarios = m.comentarios,
                idUsuario = m.idUsuario
            }).ToList();

            return Ok(mermasFiltradas);
        }



        [HttpPost("Agregar")]
        public async Task<ActionResult> AgregarMerma([FromBody] Merma request)
        {
            try
            {

           
                await _context.Merma.AddAsync(request);
                await _context.SaveChangesAsync();

                return Ok(request);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al agregar la merma: {ex.Message}");
                Console.WriteLine(ex.StackTrace);

                return StatusCode(500, "Ocurrió un error al agregar la merma.");
            }
        }


        [HttpDelete("Eliminar/{id}")]
        public async Task<ActionResult> EliminarMerma(int id)
        {
            var merma = await _context.Merma.FindAsync(id);

            if (merma == null)
            {
                return NotFound(new { mensaje = "Merma no encontrada" });
            }

            _context.Merma.Remove(merma);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Merma eliminado correctamente" });
        }

        



    }
}
