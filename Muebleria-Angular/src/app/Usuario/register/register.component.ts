import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IUsuarioDetalle } from '../../interfaces/IUsuarioDetalle';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  usuario: IUsuarioDetalle = {
    idUsuario: 0,
    nombreUsuario: '',
    correo: '',
    contrasenia: '',
    rol: 0,
    confirmPassword: '',
    type: 0,
  };

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  registrarUsuario(form: NgForm): void {
    if (form.invalid) {
      return;
    }
  
    if (this.usuario.contrasenia !== this.usuario.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }
    if (!this.validatePassword(this.usuario.contrasenia)) {
      this.errorMessage =
        'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un carácter especial.';
      return;
    }
  
    this.authService.registerUsuario(this.usuario).subscribe(
      response => {
        console.log('Usuario registrado con éxito', response);
        this.router.navigate(['/login']); 
      },
      error => {
        console.error('Error al registrar el usuario', error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Hubo un problema al registrar el usuario. Inténtalo de nuevo.';
        }
      }
    );
  }
  validatePassword(contrasenia: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(contrasenia);
  }
  
}

