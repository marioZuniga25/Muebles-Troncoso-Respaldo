import { Component, EventEmitter, Output } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { IUsuarioDetalle } from '../../interfaces/IUsuarioDetalle';

@Component({
  selector: 'app-buscador-usuario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './buscador-usuario.component.html',
  styleUrls: ['./buscador-usuario.component.css']
})
export class BuscadorUsuarioComponent {
  searchTerm: string = '';
  @Output() searchResults: EventEmitter<IUsuarioDetalle[]> = new EventEmitter<IUsuarioDetalle[]>();

  constructor(private authService: AuthService) {}

  onSearchKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault(); // Evita que el formulario se envíe si está dentro de uno
      this.performSearch();
    }
  }

  onSearchClear(): void {
    if (this.searchTerm.trim() === '') {
      this.authService.getAllUsuarios().subscribe(users => {
        this.searchResults.emit(users); // Emitir todos los usuarios cuando el campo de búsqueda esté vacío
      });
    }
  }

  private performSearch(): void {
    if (this.searchTerm.trim()) {
      this.authService.searchUsuariosPorNombre(this.searchTerm).pipe(
        catchError(err => {
          console.error('Error en la búsqueda:', err);
          return of([]); // Emitir una lista vacía en caso de error
        })
      ).subscribe((results) => {
        this.searchResults.emit(results);
      });
    } else {
      this.onSearchClear();
    }
  }
}
