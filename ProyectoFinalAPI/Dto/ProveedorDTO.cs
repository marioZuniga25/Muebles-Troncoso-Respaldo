namespace ProyectoFinalAPI.Dto
{
 public class ProveedorDTO
 {
  public int idProveedor { get; set; }
  public string nombreProveedor { get; set; }
  public string telefono { get; set; }
  public string correo { get; set; }
  public List<string> nombresMateriasPrimas { get; set; }  // Devolvemos solo los nombres de las materias primas que vende
 }

}
