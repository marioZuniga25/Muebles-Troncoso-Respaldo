namespace ProyectoFinalAPI.Models
{
    public class Usuario
    {
        public int idUsuario { get; set; }
        public string nombreUsuario{ get; set; }
        public string correo { get; set; }
        public string contrasenia { get; set;}
        public int rol { get; set;}

        public int type { get; set; }


        // // Recuperación de contraseña
        public string? ResetToken { get; set; }
        public DateTime? ResetTokenExpires { get; set; }
    }
}
