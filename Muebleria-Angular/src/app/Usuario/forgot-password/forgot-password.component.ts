import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  isButtonDisabled: boolean = false; // Controla si el botón está deshabilitado

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.errorMessage = 'Por favor ingresa un correo válido.';
      return;
    }
  
    const { correo } = this.forgotPasswordForm.value;
    this.isButtonDisabled = true; // Deshabilita el botón tras hacer la solicitud
  
    this.authService.forgotPassword(correo).subscribe(
      () => {
        this.successMessage = 'Correo enviado con éxito. Revisa tu bandeja de entrada.';
        this.errorMessage = '';
      },
      (error) => {
        console.error('Error al enviar el correo', error);
  
        if (error.status === 400 && error.error.message === "Ya se ha iniciado un proceso de recuperación. Inténtalo más tarde.") {
          this.errorMessage = 'Se ha iniciado un proceso de recuperación de contraseña, inténtalo nuevamente más tarde.';
        } else {
          this.errorMessage = 'El correo no está registrado.';
        }
        this.isButtonDisabled = false; // Vuelve a habilitar el botón si hubo error
        this.successMessage = '';
      }
    );
  }
  
}
