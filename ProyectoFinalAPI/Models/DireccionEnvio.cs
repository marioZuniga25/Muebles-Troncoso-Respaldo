using System.Text.Json.Serialization;

public class DireccionEnvio
{
    public int Id { get; set; }
    public string NombreDireccion { get; set; }
    public bool EsPredeterminada { get; set; }
    public string Calle { get; set; }
    public string Numero { get; set; }
    public string Colonia { get; set; }
    public string Ciudad { get; set; }
    public string Estado { get; set; }
    public string CodigoPostal { get; set; }

    public int PersonaId { get; set; } // Foreign key
    [JsonIgnore] // Evita el ciclo
    public Persona? Persona { get; set; } // Navigation property
}
