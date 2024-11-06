using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinalAPI.Models;
using Serilog;

namespace ProyectoFinalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactoController : ControllerBase
    {
        private readonly ProyectoContext _context;
        private readonly ILogger<ContactoController> _logger;

        public ContactoController(ProyectoContext context, ILogger<ContactoController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Obtener todos los contactos
        [HttpGet("ListadoContactos")]
        public async Task<ActionResult<IEnumerable<Contacto>>> GetListadoContactos()
        {
            try
            {
                _logger.LogInformation("Obteniendo la lista de contactos");
                var contactos = await _context.Contactos.ToListAsync();
                return Ok(contactos);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener contactos: {ex.Message}");
                return StatusCode(500, "Error interno del servidor.");
            }
        }

        // Obtener un contacto por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Contacto>> GetContactoById(int id)
        {
            try
            {
                _logger.LogInformation("Obteniendo contacto con ID: {id}", id);
                var contacto = await _context.Contactos.FindAsync(id);

                if (contacto == null)
                {
                    _logger.LogWarning("Contacto con ID {id} no encontrado", id);
                    return NotFound();
                }

                return Ok(contacto);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener contacto con ID {id}: {ex.Message}");
                return StatusCode(500, "Error interno del servidor.");
            }
        }

        // Agregar un nuevo contacto
        [HttpPost("Agregar")]
        public async Task<ActionResult> AgregarContacto([FromBody] Contacto request)
        {
            if (request == null)
            {
                _logger.LogError("Intento de agregar un contacto nulo.");
                return BadRequest("Contacto no puede ser nulo.");
            }

            try
            {
                var newContacto = new Contacto
                {
                    Nombre = request.Nombre,
                    Correo = request.Correo,
                    Telefono = request.Telefono,
                    Mensaje = request.Mensaje
                };

                await _context.Contactos.AddAsync(newContacto);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Se ha agregado un nuevo contacto: {Nombre}", newContacto.Nombre);
                return Ok(newContacto);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al agregar contacto: {ex.Message}");
                return StatusCode(500, "Error interno del servidor.");
            }
        }

        // Modificar un contacto existente
        [HttpPut("Modificar/{id}")]
        public async Task<ActionResult> ModificarContacto(int id, [FromBody] Contacto request)
        {
            try
            {
                _logger.LogInformation("Modificando contacto con ID: {id}", id);
                var contactoModificar = await _context.Contactos.FindAsync(id);

                if (contactoModificar == null)
                {
                    _logger.LogWarning("Contacto con ID {id} no encontrado para modificar", id);
                    return NotFound("Contacto no encontrado");
                }

                // Actualizar los campos necesarios
                contactoModificar.Nombre = request.Nombre;
                contactoModificar.Correo = request.Correo;
                contactoModificar.Telefono = request.Telefono;
                contactoModificar.Mensaje = request.Mensaje;

                // Guardar cambios
                await _context.SaveChangesAsync();
                _logger.LogInformation("Contacto con ID: {id} ha sido modificado", id);

                return Ok(contactoModificar);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al modificar contacto con ID {id}: {ex.Message}");
                return StatusCode(500, "Error interno del servidor.");
            }
        }

        // Eliminar un contacto por ID
        [HttpDelete("Eliminar/{id}")]
        public async Task<ActionResult> EliminarContacto(int id)
        {
            try
            {
                _logger.LogInformation("Eliminando contacto con ID: {id}", id);
                var contactoEliminar = await _context.Contactos.FindAsync(id);

                if (contactoEliminar == null)
                {
                    _logger.LogWarning("Contacto con ID {id} no encontrado para eliminar", id);
                    return NotFound(new { mensaje = "Contacto no encontrado" });
                }

                _context.Contactos.Remove(contactoEliminar);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Contacto con ID: {id} ha sido eliminado correctamente", id);
                return Ok(new { mensaje = "Contacto eliminado correctamente" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al eliminar contacto con ID {id}: {ex.Message}");
                return StatusCode(500, "Error interno del servidor.");
            }
        }
    }
}
