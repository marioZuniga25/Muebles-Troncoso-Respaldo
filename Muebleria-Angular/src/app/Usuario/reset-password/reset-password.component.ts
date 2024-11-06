import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  password: string = '';
  confirmPassword: string = '';
  token: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener el token de la URL
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.router.navigate(['/']); // Redirigir al inicio si no hay token
      return;
    }

    // Verificar si el token es válido
    this.authService.validateToken(this.token).subscribe(
      (isValid) => {
        if (!isValid) {
          this.router.navigate(['/']); // Redirigir si el token es inválido o expirado
        }
      },
      (error) => {
        console.error('Error al validar el token', error);
        this.router.navigate(['/']); // Redirigir en caso de error
      }
    );
  }

  onSubmit(form: NgForm): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }
  
    if (!this.validatePassword(this.password)) {
      this.errorMessage =
        'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un carácter especial.';
      return;
    }
  
    this.isSubmitting = true;
  
    // Enviar la solicitud con el token y la nueva contraseña
    this.authService.resetPassword(this.token, this.password).subscribe(
      () => {
        this.successMessage = 'Contraseña restablecida con éxito.';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/login']), 3000); // Redirigir al login después de 3 segundos
      },
      (error) => {
        console.error('Error al restablecer la contraseña', error);
        // Captura y muestra el mensaje de error específico
        const mensajeError = error.error?.message || 'Hubo un error al restablecer la contraseña.';
        this.errorMessage = mensajeError;
        this.successMessage = '';
        this.isSubmitting = false;
      }
    );
  }
  

  validatePassword(password: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }
}
