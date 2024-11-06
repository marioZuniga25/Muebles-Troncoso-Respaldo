import { Component } from '@angular/core';
import { CarritoService } from '../services/carrito/carrito.service';
import { User } from '../interfaces/AuthResponse';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BuscadorComponent } from '../buscador/buscador.component';
import { BuscadorService } from '../services/buscador.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, BuscadorComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  user: User | null = null;
  isDropdownOpen = false;
  isBuscadorVisible: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private carritoService: CarritoService,
    private buscadorService: BuscadorService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      if (user) {
        this.isAdmin = this.authService.isAdmin();
      }
    });

    // Subscribe to the buscador state
    this.buscadorService.getBuscadorState().subscribe(state => {
      this.isBuscadorVisible = state;
    });
  }

  toggleBag() {
    this.carritoService.toggleBag();
  }

  toggleDropdown(event: Event): void {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleBuscador(): void {
    this.buscadorService.toggleBuscador();
  }

  logout(): void {
    this.authService.removeUser();
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }
}
