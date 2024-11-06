import { NgxCaptchaModule } from 'ngx-captcha';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUsuarioDetalle } from '../../interfaces/IUsuarioDetalle';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthResponse } from '../../interfaces/AuthResponse';

@Component({
  selector: 'app-login-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxCaptchaModule],
  templateUrl: './login-usuario.component.html',
  styleUrls: ['./login-usuario.component.css']
})
export class LoginUsuarioComponent implements OnInit {
  protected aFormGroup!: FormGroup;
  siteKey: string = "6LcPr2sqAAAAAOXw944gf7A7U8gd2KvcwouZBnGz";
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

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {
    this.aFormGroup = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      recaptcha: ['', Validators.required]
    });
  }

  ngOnInit() {}

  onSubmit(): void {
    if (this.aFormGroup.invalid) {
      return;
    }
    this.loginData.correo = this.aFormGroup.value.correo;
    this.loginData.contrasenia = this.aFormGroup.value.password;
    this.errorMessage = "";

    this.authService.login(this.loginData).subscribe(
      (response: AuthResponse) => {
        if (response && response.user) {
          this.idUsuarioLocal = response.user.idUsuario.toString();
          console.log(this.idUsuarioLocal);
          localStorage.setItem('userId', this.idUsuarioLocal);
          this.router.navigate(['/']);
        }
      },
      (error) => {
        console.error('Error en el inicio de sesión', error);
        this.errorMessage = error.error.message;
      }
    );
  }
}
