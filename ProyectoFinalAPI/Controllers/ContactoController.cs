using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinalAPI.Models;

namespace ProyectoFinalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactoController : ControllerBase
    {
        private readonly ProyectoContext _context;

        public ContactoController(ProyectoContext context)
        {
            _context = context;
        }

        // Obtener todos los contactos
        [HttpGet("ListadoContactos")]
        public async Task<ActionResult<IEnumerable<Contacto>>> GetListadoContactos()
        {
            var contactos = await _context.Contactos.ToListAsync();
            return Ok(contactos);
        }

        // Obtener un contacto por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Contacto>> GetContactoById(int id)
        {
            var contacto = await _context.Contactos.FindAsync(id);

            if (contacto == null)
            {
                return NotFound();
            }

            return Ok(contacto);
        }

        // Agregar un nuevo contacto
        [HttpPost("Agregar")]
        public async Task<ActionResult> AgregarContacto([FromBody] Contacto request)
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

            return Ok(newContacto);
        }

        // Modificar un contacto existente
        [HttpPut("Modificar/{id}")]
        public async Task<ActionResult> ModificarContacto(int id, [FromBody] Contacto request)
        {
            var contactoModificar = await _context.Contactos.FindAsync(id);

            if (contactoModificar == null)
            {
                return BadRequest("Contacto no encontrado");
            }

            // Actualizar los campos necesarios
            contactoModificar.Nombre = request.Nombre;
            contactoModificar.Correo = request.Correo;
            contactoModificar.Telefono = request.Telefono;
            contactoModificar.Mensaje = request.Mensaje;

            // Guardar cambios
            await _context.SaveChangesAsync();

            return Ok(contactoModificar);
        }

        // Eliminar un contacto por ID
        [HttpDelete("Eliminar/{id}")]
        public async Task<ActionResult> EliminarContacto(int id)
        {
            var contactoEliminar = await _context.Contactos.FindAsync(id);

            if (contactoEliminar == null)
            {
                return NotFound(new { mensaje = "Contacto no encontrado" });
            }

            _context.Contactos.Remove(contactoEliminar);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Contacto eliminado correctamente" });
        }
    }
}
