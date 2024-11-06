using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProyectoFinalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PerfilController : ControllerBase
    {
        private readonly ProyectoContext _context;

        public PerfilController(ProyectoContext context)
        {
            _context = context;
        }

        // Obtener detalles de la persona junto con direcciones
        [HttpGet("Detalles/{id:int}")]
        public async Task<ActionResult<Persona>> GetDetallesPersona(int id)
        {
            var persona = await _context.Personas.Include(p => p.DireccionesEnvio).FirstOrDefaultAsync(p => p.Id == id);
            if (persona == null)
            {
                return NotFound();
            }
            return Ok(persona);
        }

        [HttpPost("AgregarPerfil")]
        public async Task<IActionResult> AgregarPerfil([FromBody] Persona persona)
        {
            if (persona == null || persona.UsuarioId <= 0)
            {
                return BadRequest();
            }

            await _context.Personas.AddAsync(persona);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDetallesPersona), new { id = persona.Id }, persona);
        }



        // Modificar datos de perfil existente
        [HttpPut("ModificarPerfil/{id:int}")]
        public async Task<IActionResult> ModificarPerfil(int id, [FromBody] Persona persona)
        {
            if (id != persona.Id)
            {
                return BadRequest();
            }

            var personaExistente = await _context.Personas.FindAsync(id);
            if (personaExistente == null)
            {
                return NotFound();
            }

            // Actualiza los datos de perfil
            personaExistente.Nombre = persona.Nombre;
            personaExistente.Apellidos = persona.Apellidos;
            personaExistente.Telefono = persona.Telefono;
            personaExistente.Correo = persona.Correo;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Endpoint para agregar dirección a una persona existente
        [HttpPost("AgregarDireccion/{personaId:int}")]
        public async Task<IActionResult> AgregarDireccion(int personaId, [FromBody] DireccionEnvio direccionEnvio)
        {
            if (direccionEnvio == null)
            {
                return BadRequest();
            }

            direccionEnvio.PersonaId = personaId; // Asigna el ID de la persona a la dirección
            await _context.DireccionesEnvio.AddAsync(direccionEnvio);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDetallesPersona), new { id = personaId }, direccionEnvio);
        }


        [HttpPut("ModificarDireccion/{id:int}")]
        public async Task<IActionResult> ModificarDireccion(int id, [FromBody] DireccionEnvio direccionEnvio)
        {
            if (id != direccionEnvio.Id)
            {
                return BadRequest();
            }

            var direccionExistente = await _context.DireccionesEnvio.FindAsync(id);
            if (direccionExistente == null)
            {
                return NotFound();
            }

            direccionExistente.NombreDireccion = direccionEnvio.NombreDireccion;
            direccionExistente.EsPredeterminada = direccionEnvio.EsPredeterminada;
            direccionExistente.Calle = direccionEnvio.Calle;
            direccionExistente.Numero = direccionEnvio.Numero;
            direccionExistente.Colonia = direccionEnvio.Colonia;
            direccionExistente.Ciudad = direccionEnvio.Ciudad;
            direccionExistente.Estado = direccionEnvio.Estado;
            direccionExistente.CodigoPostal = direccionEnvio.CodigoPostal;

            await _context.SaveChangesAsync();
            return NoContent();
        }



        // Eliminar dirección
        [HttpDelete("EliminarDireccion/{id:int}")]
        public async Task<IActionResult> EliminarDireccion(int id)
        {
            var direccion = await _context.DireccionesEnvio.FindAsync(id);
            if (direccion == null)
            {
                return NotFound();
            }

            _context.DireccionesEnvio.Remove(direccion);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Endpoint para obtener las direcciones de una persona por ID
        [HttpGet("Direcciones/{personaId:int}")]
        public async Task<ActionResult<IEnumerable<DireccionEnvio>>> GetDireccionesPorPersona(int personaId)
        {
            var direcciones = await _context.DireccionesEnvio
                .Where(d => d.PersonaId == personaId)
                .ToListAsync();

            if (direcciones == null || !direcciones.Any())
            {
                return NotFound();
            }

            return Ok(direcciones);
        }

    }
}
