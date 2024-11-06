import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardAdmin implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getUser();
    if (user && user.rol === 1) {
      return true;
    } else {
      this.router.navigate(['/']); // Redirigir a una página de acceso denegado o al inicio
      return false;
    }
  }
}
