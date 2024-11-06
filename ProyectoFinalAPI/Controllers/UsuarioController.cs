using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProyectoFinalAPI.Models;
using System.Threading;
using System.Security.Cryptography;

namespace ProyectoFinalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly ProyectoContext _context;
        public UsuarioController(ProyectoContext context)
        {
            _context = context;
        }
        private async Task<bool> IsPasswordUnsafe(string password)
        {
            // Verificar si la contraseña está en la lista de contraseñas inseguras
            return await _context.ContraseniaInsegura.AnyAsync(c => c.Contrasenia == password);
        }

        [HttpGet("Listado")]
        public async Task<ActionResult> GetListadoUsuarios()
        {
            // Listar usuarios externos (type = 0) e internos (type = 1)
            var usuariosExternos = await _context.Usuario.Where(u => u.type == 0).ToListAsync();
            var usuariosInternos = await _context.Usuario.Where(u => u.type == 1).ToListAsync();

            return Ok(new
            {
                Externos = usuariosExternos,
                Internos = usuariosInternos
            });
        }

        [HttpGet("Buscar")]
        public async Task<ActionResult<IEnumerable<Usuario>>> SearchUsuario(string nameUsuario)
        {
            // Incluir la categoría relacionada en la consulta
            return await _context.Usuario.Where(u => u.nombreUsuario.Contains(nameUsuario)).ToListAsync();

        }


        [HttpPost]
        [Route("registrar")]
        public async Task<IActionResult> AddUsuario([FromBody] Usuario request, [FromServices] EmailService emailService)
        {
            if (await IsPasswordUnsafe(request.contrasenia))
            {
                return BadRequest(new { message = "La contraseña ingresada es insegura." });
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.contrasenia);

            var usuario = new Usuario
            {
                idUsuario = 0,
                nombreUsuario = request.nombreUsuario,
                correo = request.correo,
                contrasenia = hashedPassword,
                rol = request.rol,
                type = 0,
            };

            await _context.Usuario.AddAsync(usuario);
            await _context.SaveChangesAsync();

            // Preparar el correo con el template de bienvenida
            var body = System.IO.File.ReadAllText("Templates/WelcomeEmail.html")
                       .Replace("[LOGO_URL]", "https://i.imgur.com/EmvHFiH.png")
                       .Replace("[NOMBRE_USUARIO]", usuario.nombreUsuario);

            await emailService.SendEmailAsync(usuario.correo, "¡Bienvenido a nuestra plataforma!", body);

            return Ok(request);
        }

        // Endpoint para registrar empleados (usuarios internos)
        [HttpPost]
        [Route("registrarInterno")]
        public async Task<IActionResult> AddUsuarioInterno([FromBody] Usuario request)
        {
            if (await IsPasswordUnsafe(request.contrasenia))
            {
                return BadRequest(new { message = "La contraseña ingresada es insegura." });
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.contrasenia);

            var usuario = new Usuario
            {
                idUsuario = 0,
                nombreUsuario = request.nombreUsuario,
                correo = request.correo,
                contrasenia = hashedPassword,
                rol = request.rol,
                type = 1,
            };

            await _context.Usuario.AddAsync(usuario);
            await _context.SaveChangesAsync();
            return Ok(request);
        }


        [HttpPut]
        [Route("ModificarUsuario/{id:int}")]
        public async Task<IActionResult> UpdateUsuario(int id, [FromBody] Usuario request)
        {
            var usuarioModificar = await _context.Usuario.FindAsync(id);

            if (usuarioModificar == null)
            {
                return BadRequest("No existe el usuario");
            }

            usuarioModificar.nombreUsuario = request.nombreUsuario;
            usuarioModificar.correo = request.correo;

            // Verificar si se actualiza la contraseña
            if (!string.IsNullOrEmpty(request.contrasenia))
            {
                if (await IsPasswordUnsafe(request.contrasenia))
                {
                    return BadRequest(new { message = "La contraseña ingresada es insegura." });
                }
                usuarioModificar.contrasenia = BCrypt.Net.BCrypt.HashPassword(request.contrasenia);
            }

            usuarioModificar.rol = request.rol;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch
            {
                return NotFound();
            }

            return Ok();
        }


        [HttpDelete]
        [Route("EliminarUsuario/{id:int}")]
        public async Task<IActionResult> deleteUsuario(int id)
        {
            var usuarioEliminar = await _context.Usuario.FindAsync(id);

            if (usuarioEliminar == null)
            {
                return BadRequest("No se encontro el usuario.");
            }
            _context.Usuario.Remove(usuarioEliminar);

            await _context.SaveChangesAsync();

            return Ok();

        }

        [HttpGet("DetalleUsuario/{id:int}")]
        public async Task<ActionResult<Usuario>> GetUsuarioById(int id)
        {
            var usuario = await _context.Usuario.FindAsync(id);

            if (usuario == null)
            {
                return NotFound(new { message = "Usuario no encontrado." });
            }

            return Ok(usuario);
        }


        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] Usuario request, [FromServices] EmailService emailService)
        {
            var usuario = await _context.Usuario
                .Include(u => u.Persona)
                .ThenInclude(p => p.DireccionesEnvio)
                .FirstOrDefaultAsync(u =>
                    (u.nombreUsuario == request.nombreUsuario || u.correo == request.correo));

            if (usuario == null)
            {
                return Unauthorized(new { message = "Usuario o contraseña incorrectos" });
            }

            // Verificar si el usuario está bloqueado
            if (usuario.EstaBloqueado)
            {
                return Unauthorized(new { message = "Tu usuario está bloqueado. Restablece la contraseña para volver a ingresar." });
            }

            // Verificar la contraseña
            if (!BCrypt.Net.BCrypt.Verify(request.contrasenia, usuario.contrasenia))
            {
                usuario.IntentosFallidos++;
                if (usuario.IntentosFallidos >= 3)
                {
                    usuario.EstaBloqueado = true;

                    // Generar el token de recuperación y su expiración
                    var token = GenerateResetToken();
                    usuario.ResetToken = token;
                    usuario.ResetTokenExpires = DateTime.UtcNow.AddMinutes(15); // Expira en 15 minutos

                    await _context.SaveChangesAsync();

                    // Enviar correo de notificación de bloqueo con el enlace para restablecer la contraseña
                    var resetLink = $"http://localhost:4200/reset-password?token={token}";
                    var body = System.IO.File.ReadAllText("Templates/BlockedAccount.html")
                        .Replace("[LOGO_URL]", "https://i.imgur.com/EmvHFiH.png")
                        .Replace("[RESET_LINK]", resetLink);

                    await emailService.SendEmailAsync(usuario.correo, "Cuenta bloqueada", body);

                    return Unauthorized(new { message = "Tu cuenta ha sido bloqueada. Revisa tu correo para más detalles y restablece tu contraseña." });
                }

                await _context.SaveChangesAsync();
                return Unauthorized(new { message = "Usuario o contraseña incorrectos" });
            }

            // Restablecer los intentos fallidos al iniciar sesión correctamente
            usuario.IntentosFallidos = 0;
            await _context.SaveChangesAsync();

            // Obtener la zona horaria de León, Guanajuato (América/México_Ciudad)
            var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("America/Mexico_City");

            // Convertir la hora UTC a la hora local de la zona horaria
            var fechaInicioSesionLocal = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneInfo);

            // Guardar un log de inicio de sesión con la hora local
            var log = new LogInicioSesion
            {
                UsuarioId = usuario.idUsuario,
                FechaInicioSesion = fechaInicioSesionLocal,
                IpDireccion = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Desconocida"
            };

            await _context.LogInicioSesion.AddAsync(log);
            await _context.SaveChangesAsync();

            var response = new
            {
                message = "Inicio de sesión exitoso",
                user = new
                {
                    usuario.idUsuario,
                    usuario.nombreUsuario,
                    usuario.correo,
                    usuario.rol,
                    usuario.type,
                    persona = new
                    {
                        usuario.Persona?.Id,
                        usuario.Persona?.Nombre,
                        usuario.Persona?.Apellidos,
                        usuario.Persona?.Telefono,
                        usuario.Persona?.Correo,
                        DireccionesEnvio = usuario.Persona?.DireccionesEnvio?.Select(d => new
                        {
                            d.Id,
                            d.NombreDireccion,
                            d.Calle,
                            d.Numero,
                            d.Colonia,
                            d.Ciudad,
                            d.Estado,
                            d.CodigoPostal,
                            d.EsPredeterminada
                        }).ToList()
                    }
                }
            };

            return Ok(response);
        }
        [HttpGet("BuscarPorNombre")]
        public async Task<ActionResult<IEnumerable<Usuario>>> SearchUsuariosPorNombre(string nombre)
        {
            if (string.IsNullOrEmpty(nombre))
            {
                return BadRequest("El nombre de usuario es requerido.");
            }

            var usuarios = await _context.Usuario
                .Where(u => u.nombreUsuario.Contains(nombre))
                .ToListAsync();

            return Ok(usuarios); // Devuelve 200 OK con una lista (posiblemente vacía)
        }

        [HttpPost]
        [Route("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request, [FromServices] EmailService emailService)
        {
            var usuario = await _context.Usuario.FirstOrDefaultAsync(u => u.correo == request.Correo);

            if (usuario == null)
            {
                return BadRequest(new { message = "El correo no está registrado." });
            }

            // Verificar si ya hay un token activo y no ha expirado
            if (usuario.ResetTokenExpires > DateTime.UtcNow)
            {
                return BadRequest(new { message = "Ya se ha iniciado un proceso de recuperación. Inténtalo más tarde." });
            }

            // Generar un nuevo token y establecer su fecha de expiración
            var token = GenerateResetToken();
            usuario.ResetToken = token;
            usuario.ResetTokenExpires = DateTime.UtcNow.AddMinutes(5);

            await _context.SaveChangesAsync();

            // Preparar el correo con el template
            var resetLink = $"http://localhost:4200/reset-password?token={token}";
            var body = System.IO.File.ReadAllText("Templates/ForgotPassword.html")
                       .Replace("[LOGO_URL]", "https://i.imgur.com/EmvHFiH.png")
                       .Replace("[RESET_LINK]", resetLink);

            await emailService.SendEmailAsync(usuario.correo, "Recuperación de contraseña", body);

            return Ok(new { message = "Correo de recuperación enviado." });
        }


        private string GenerateResetToken()
        {
            using (var rng = RandomNumberGenerator.Create())
            {
                var tokenData = new byte[32]; // Generar 32 bytes aleatorios
                rng.GetBytes(tokenData);

                // Convertir a Base64 y reemplazar caracteres problemáticos
                return Convert.ToBase64String(tokenData)
                              .Replace("+", "-")
                              .Replace("/", "_")
                              .Replace("=", ""); // Eliminar relleno
            }
        }

        [HttpGet]
        [Route("validate-token")]
        public async Task<IActionResult> ValidateToken(string token)
        {
            var usuario = await _context.Usuario.FirstOrDefaultAsync(u => u.ResetToken == token && u.ResetTokenExpires > DateTime.UtcNow);
            if (usuario == null)
            {
                return BadRequest(new { message = "El token es inválido o ha expirado." });
            }

            return Ok(true);
        }

        [HttpGet]
        [Route("UltimoInicioSesion/{id:int}")]
        public async Task<IActionResult> GetUltimoInicioSesion(int id)
        {
            // Verificar si el usuario existe
            var usuario = await _context.Usuario.FindAsync(id);
            if (usuario == null)
            {
                return NotFound(new { message = "Usuario no encontrado." });
            }

            // Obtener el segundo último inicio de sesión
            var ultimoInicioSesion = await _context.LogInicioSesion
                .Where(log => log.UsuarioId == id)
                .OrderByDescending(log => log.FechaInicioSesion)
                .Skip(1) // Saltar el inicio de sesión más reciente
                .FirstOrDefaultAsync();

            if (ultimoInicioSesion == null)
            {
                return NotFound(new { message = "No se encontraron registros de inicio de sesión previos." });
            }

            return Ok(new
            {
                FechaInicioSesion = ultimoInicioSesion.FechaInicioSesion,
                IpDireccion = ultimoInicioSesion.IpDireccion
            });
        }

        [HttpPost]
        [Route("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request, [FromServices] EmailService emailService)
        {
            var usuario = await _context.Usuario.FirstOrDefaultAsync(
                u => u.ResetToken == request.Token && u.ResetTokenExpires > DateTime.UtcNow);

            if (usuario == null)
            {
                return BadRequest(new { message = "El token es inválido o ha expirado." });
            }

            if (await IsPasswordUnsafe(request.NuevaContrasenia))
            {
                return BadRequest(new { message = "La nueva contraseña ingresada es insegura." });
            }

            // Cambiar la contraseña y limpiar el token
            usuario.contrasenia = BCrypt.Net.BCrypt.HashPassword(request.NuevaContrasenia);
            usuario.ResetToken = null;
            usuario.ResetTokenExpires = null;

            // Verificar si el usuario está bloqueado y restablecer los intentos
            if (usuario.EstaBloqueado)
            {
                usuario.IntentosFallidos = 0; // Restablecer intentos
                usuario.EstaBloqueado = false; // Desbloquear al usuario
            }

            await _context.SaveChangesAsync();

            // Preparar el correo con el template de confirmación de cambio de contraseña
            var body = System.IO.File.ReadAllText("Templates/PasswordUpdated.html")
                    .Replace("[LOGO_URL]", "https://i.imgur.com/EmvHFiH.png");

            await emailService.SendEmailAsync(usuario.correo, "Tu contraseña ha sido actualizada", body);

            return Ok(new { message = "Contraseña restablecida con éxito." });
        }
    }


}
