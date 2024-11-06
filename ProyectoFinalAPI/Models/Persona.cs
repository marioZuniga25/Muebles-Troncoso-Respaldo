using ProyectoFinalAPI.Models;

public class Persona
{
    public int Id { get; set; }
    public string Nombre { get; set; }
    public string Apellidos { get; set; }
    public string Telefono { get; set; }
    public string Correo { get; set; }

    // Propiedad para referenciar al usuario
    public int UsuarioId { get; set; }
    public Usuario? Usuario { get; set; } // Navegación a Usuario

    public List<DireccionEnvio>? DireccionesEnvio { get; set; }
}
