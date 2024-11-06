import { Component, OnInit } from '@angular/core';
import { IUsuarioDetalle } from '../../interfaces/IUsuarioDetalle';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthResponse } from '../../interfaces/AuthResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData: IUsuarioDetalle = {
    idUsuario: 0,
    nombreUsuario: '',
    correo: '',
    contrasenia: '',
    rol: 0,
    type: 0,
  };
  errorMessage: string = '';
  idUsuarioLocal: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    if(this.authService.isAdmin())
      this.router.navigate(['/admin/inicio'])
  }

  


  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.authService.login(this.loginData).subscribe(
      (response: AuthResponse) => {
        if (response && response.user) {
          this.idUsuarioLocal = response.user.idUsuario.toString();
          console.log(this.idUsuarioLocal);
          localStorage.setItem('userId', this.idUsuarioLocal);
          // Verificar si el usuario tiene el rol de administrador (rol 1)
          if (response.user.rol === 1) {
            // Guardar usuario en el servicio
            this.authService.setUser(response.user);

            // Redirigir a la página de administración después de iniciar sesión
            this.router.navigate(['/admin/inicio']);
            location.reload();
          } else {
            // Mostrar mensaje de error si el usuario no es administrador
            this.errorMessage = 'Acceso denegado.';
          }
        }
      },
      (error) => {
        console.error('Error en el inicio de sesión', error);
        this.errorMessage = 'Correo o contraseña incorrectos. Inténtalo de nuevo.';
      }
    );
  }


  // Declaración de la variable user en el componente, como en MenuComponent
  user: IUsuarioDetalle | null = null;
}
