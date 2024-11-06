import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../alert/alert.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-detalle-usuario',
  standalone: true,
  imports: [FormsModule, CommonModule, AlertComponent],
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.css']
})
export class DetalleUsuarioComponent implements OnChanges {
  @Input() usuario$: Observable<any> | null = null;
  @Output() usuarioActualizado = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  usuario: any;
  alertMessage: string = '';
  alertType: 'success' | 'info' | 'warning' | 'danger' = 'info';
  isAlertVisible: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuario$'] && this.usuario$) {
      this.usuario$.subscribe(data => {
        this.usuario = { ...data };
        // Asegúrate de que el type esté definido
        console.log('Usuario recibido:', this.usuario); // Para depuración
      });
    }
  }


  actualizarUsuario(): void {
    if (!this.usuario.nombreUsuario || !this.usuario.correo || this.usuario.rol === undefined) {
      this.showAlert('Por favor, complete todos los campos requeridos.', 'danger');
      return;
    }
    if (!this.validatePassword(this.usuario.contrasenia)) {
      this.showAlert('La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un carácter especial.', 'danger');
      return;
    }

    // Asegúrate de que rol sea un número
    this.usuario.rol = Number(this.usuario.rol);

    if (this.usuario) {
      // Si el idUsuario es null, se considera que es una creación
      if (this.usuario.idUsuario === null) {
        // Asigna 0 a idUsuario si es null
        this.usuario.idUsuario = 0;
        this.authService.createUsuario(this.usuario).subscribe(
          response => {
            this.showAlert('Usuario creado correctamente.', 'success');
            this.usuarioActualizado.emit();
            this.cerrarDetalle();
          },
          error => {
            // Captura y muestra el mensaje de error específico
            const mensajeError = error.error?.message || 'Error al crear el usuario.';
            this.showAlert(mensajeError, 'danger');
          }
        );
      } else {
        this.authService.updateUsuario(this.usuario.idUsuario, this.usuario).subscribe(
          response => {
            this.showAlert('Usuario actualizado correctamente.', 'success');
            this.usuarioActualizado.emit();
            this.cerrarDetalle();
          },
          error => {
            // Captura y muestra el mensaje de error específico
            const mensajeError = error.error?.message || 'Error al actualizar el usuario.';
            this.showAlert(mensajeError, 'danger');
          }
        );
      }
    }
  }

  cerrarDetalle(): void {
    this.usuario = null;
    this.cancelar.emit();
  }

  showAlert(message: string, type: 'success' | 'info' | 'warning' | 'danger'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.isAlertVisible = true;

    setTimeout(() => {
      this.isAlertVisible = false;
    }, 3000);
  }
  validatePassword(contrasenia: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(contrasenia);
  }
}
