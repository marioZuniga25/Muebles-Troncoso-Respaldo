import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/AuthResponse';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  user: User | null = null;
  isProductosDropdownOpen = false;
  isUserDropdownOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  toggleProductosDropdown(event: Event): void {
    event.preventDefault();
    this.isProductosDropdownOpen = !this.isProductosDropdownOpen;
    // Asegúrate de que solo un dropdown esté abierto a la vez
    if (this.isProductosDropdownOpen) {
      this.isUserDropdownOpen = false;
    }
  }

  toggleUserDropdown(event: Event): void {
    event.preventDefault();
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
    // Asegúrate de que solo un dropdown esté abierto a la vez
    if (this.isUserDropdownOpen) {
      this.isProductosDropdownOpen = false;
    }
  }

  logout(): void {
    this.authService.removeUser();
    this.user = null;
    this.router.navigate(['/admin']);
    localStorage.removeItem('userId');
  }
}
