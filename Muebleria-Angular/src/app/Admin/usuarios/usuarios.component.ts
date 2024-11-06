import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetalleUsuarioComponent } from "../detalle-usuario/detalle-usuario.component";
import { AuthService } from '../../services/auth.service';
import { IUsuarioDetalle } from '../../interfaces/IUsuarioDetalle';
import { BuscadorCompartidoComponent } from '../shared/buscador-compartido/buscador-compartido.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [AsyncPipe, NgForOf, NgIf, FormsModule, DetalleUsuarioComponent, BuscadorCompartidoComponent],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: IUsuarioDetalle[] = []; // Mantiene la lista completa de usuarios
  externos: IUsuarioDetalle[] = []; // Usuarios externos
  internos: IUsuarioDetalle[] = []; // Usuarios internos
  resultadosBusqueda: IUsuarioDetalle[] = []; // Propiedad para almacenar los resultados de la búsqueda
  usuarioSeleccionado$: Observable<IUsuarioDetalle> | null = null;
  tipoUsuarioSeleccionado: string = 'externos'; // Valor predeterminado para el tipo de usuario

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios(): void {
    this.authService.getAllUsuarios().subscribe(
      (data: any) => {
        this.externos = data.externos;  
        this.internos = data.internos;  
        this.filtrarUsuariosPorTipo(); 
      },
      (error) => {
        console.error('Error al obtener los usuarios', error);
      }
    );
  }

  filtrarUsuariosPorTipo(): void {
    if (this.tipoUsuarioSeleccionado === 'externos') {
      this.resultadosBusqueda = this.externos;
    } else {
      this.resultadosBusqueda = this.internos;
    }
  }

  onSearchResults(resultados: IUsuarioDetalle[]): void {
    this.resultadosBusqueda = resultados;
  }

  actualizarUsuario(): void {
    this.authService.getAllUsuarios().subscribe(data => {
      this.externos = data.externos;
      this.internos = data.internos;
      this.filtrarUsuariosPorTipo();
    });
    this.usuarioSeleccionado$ = null;
  }

  cancelar(): void {
    this.usuarioSeleccionado$ = null;
  }

  trackById(index: number, usuario: IUsuarioDetalle): number {
    return usuario.idUsuario || 0;
  }

  verDetalle(idUsuario: number): void {
    this.usuarioSeleccionado$ = this.authService.getUsuarioById(idUsuario);
  }

  actualizarRol(idUsuario: number, nuevoRol: number): void {
    this.authService.updateUsuarioRol(idUsuario, nuevoRol).subscribe(
      (response) => {
        console.log('Rol actualizado con éxito', response);
      },
      (error) => {
        console.error('Error al actualizar el rol', error);
      }
    );
  }

  agregarNuevoUsuario(): void {
    // Inicializa un nuevo usuario con los campos necesarios
    this.usuarioSeleccionado$ = of({
      idUsuario: null,
      nombreUsuario: '',
      correo: '',
      contrasenia: '',
      rol: 0, // Cambia esto según tu lógica, 0 para 'Usuario' y 1 para 'Administrador'
      type: 1 // Establecer como interno
    });
  }  
}
