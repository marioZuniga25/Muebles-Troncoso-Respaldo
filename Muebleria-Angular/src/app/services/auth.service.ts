import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { IUsuarioDetalle } from '../interfaces/IUsuarioDetalle';
import { AuthResponse, User } from '../interfaces/AuthResponse';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = environment.endpoint;
  private userKey = "currentUser"; // Asegúrate de tener una clave única
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;


  constructor(private http: HttpClient) { 
    const storedUser = JSON.parse(localStorage.getItem(this.userKey) || 'null');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }
  // Obtener detalles de un usuario por ID
  getUsuarioById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}usuario/DetalleUsuario/${id}`);
  }

  setUser(user: User): void {
    try {
      const userString = JSON.stringify(user);
      localStorage.setItem(this.userKey, userString);
      this.currentUserSubject.next(user); // Notifica a los suscriptores del cambio
    } catch (error) {
      console.error('Error al guardar en LocalStorage:', error);
    }
  }
  

  createUsuario(usuario: IUsuarioDetalle): Observable<any> {
    return this.http.post(`${this.apiUrl}usuario/registrarInterno`, usuario);
  }
  
  resetPassword(token: string, nuevaContrasenia: string): Observable<any> {
    const body = { token, nuevaContrasenia };
    return this.http.post(`${this.apiUrl}usuario/reset-password`, body);
  }
  
  validateToken(token: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}usuario/validate-token?token=${token}`);
  }

  //Saber si es admin
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.rol === 1; 
  }

  //Saber si está logueado
  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

  // Obtener todos los usuarios
  getAllUsuarios = (): Observable<{ externos: IUsuarioDetalle[], internos: IUsuarioDetalle[] }> =>
    this.http.get<{ externos: IUsuarioDetalle[], internos: IUsuarioDetalle[] }>(`${this.apiUrl}usuario/listado`);

  registerUsuario (data: IUsuarioDetalle): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}usuario/registrar`, data);
  }

  forgotPassword(correo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}usuario/forgot-password`, { correo });
  }

  getUser(): User | null {
    try {
      const storedUser = localStorage.getItem(this.userKey);
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      return null;
    } catch (error) {
      console.error('Error al leer desde LocalStorage:', error);
      return null;
    }
  }
  

  removeUser(): void {
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null); // Notifica a los suscriptores del cambio
  }
  
  login(data: IUsuarioDetalle): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}usuario/login`, data)
      .pipe(
        map((response: AuthResponse) => {
          if (response && response.user) {
            console.log('Respuesta completa del servidor:', response.user); // Para verificar la respuesta
            this.setUser(response.user); // Guardar el usuario completo en LocalStorage
          }
          return response;
        })
      );
  }
  

  searchUsuariosPorNombre(nombre: string): Observable<IUsuarioDetalle[]> {
    return this.http.get<IUsuarioDetalle[]>(`${this.apiUrl}usuario/BuscarPorNombre?nombre=${nombre}`);
  }

  // Actualizar el rol de un usuario (0 = usuario, 1 = administrador)
  updateUsuarioRol(idUsuario: number, nuevoRol: number): Observable<any> {
    // Primero, obtenemos el usuario por su ID
    return this.getUsuarioById(idUsuario).pipe(
      // Luego, usamos el operador 'switchMap' para actualizar el rol del usuario y enviarlo de vuelta al servidor
      switchMap((usuario: any) => {
        // Modificamos el rol del usuario
        usuario.rol = nuevoRol;
  
        // Ahora, enviamos el usuario completo con el rol actualizado
        return this.http.put(`${this.apiUrl}usuario/ModificarUsuario/${idUsuario}`, usuario);
      })
    );
  }

  updateUsuario(idUsuario: number, usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}usuario/ModificarUsuario/${idUsuario}`, usuario);
  }

  // Método para obtener el último inicio de sesión de un usuario
  getUltimoInicioSesion(userId: number): Observable<{ fechaInicioSesion: Date }> {
    return this.http.get<{ fechaInicioSesion: Date }>(`${this.apiUrl}usuario/UltimoInicioSesion/${userId}`);
  }
  
}
