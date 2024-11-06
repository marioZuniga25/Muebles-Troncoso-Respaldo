import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUsuarioDetalle } from '../interfaces/IUsuarioDetalle';
import { IUtarjetas } from '../interfaces/ITarjetas';
import { IPersona } from '../interfaces/IPersona'; //
import { IDireccionEnvio } from '../interfaces/IDireccionEnvio'; 
@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  
  private apiUrl = 'http://localhost:5194/api/Perfil'; // Cambié a la URL correcta para los perfiles
  private tarjetasUrl = 'http://localhost:5194/api/Tarjetas';

  constructor(private http: HttpClient) { }

  // Obtener detalles de usuario
  getUserDetails(userId: number): Observable<IUsuarioDetalle> {
    return this.http.get<IUsuarioDetalle>(`${this.apiUrl}/Detalles/${userId}`);
  }
  
  // Método para obtener las direcciones de una persona por ID
  getDireccionesPorPersona(personaId: number): Observable<IDireccionEnvio[]> {
    return this.http.get<IDireccionEnvio[]>(`${this.apiUrl}/Direcciones/${personaId}`);
  }

  // Agregar perfil
  addProfile(persona: IPersona): Observable<IPersona> {
    return this.http.post<IPersona>(`${this.apiUrl}/AgregarPerfil`, persona);
  }

  // Modificar perfil
  updateProfile(id: number, persona: IPersona): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/ModificarPerfil/${id}`, persona);
  }

  // Obtener tarjetas de usuario
  getUserCards(userId: number): Observable<IUtarjetas[]> {
    return this.http.get<IUtarjetas[]>(`${this.tarjetasUrl}/usuario/${userId}`);
  }

  // Agregar tarjeta
  addCard(card: IUtarjetas): Observable<IUtarjetas> {
    return this.http.post<IUtarjetas>(this.tarjetasUrl, card);
  }

  // Eliminar tarjeta
  deleteCard(cardId: number): Observable<void> {
    return this.http.delete<void>(`${this.tarjetasUrl}/${cardId}`);
  }

  // Agregar dirección
  addAddress(personaId: number, direccionEnvio: IDireccionEnvio): Observable<IDireccionEnvio> {
    return this.http.post<IDireccionEnvio>(`${this.apiUrl}/AgregarDireccion/${personaId}`, direccionEnvio);
  }

  // Modificar dirección
  updateAddress(id: number, direccionEnvio: IDireccionEnvio): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/ModificarDireccion/${id}`, direccionEnvio);
  }

  // Eliminar dirección
  deleteAddress(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/EliminarDireccion/${id}`);
  }

  // Modificar usuario
  updateUser(id: number, usuario: IUsuarioDetalle): Observable<IUsuarioDetalle> {
    return this.http.put<IUsuarioDetalle>(`http://localhost:5194/api/Usuario/ModificarUsuario/${id}`, usuario);
  }
}
