import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buscador-compartido',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './buscador-compartido.component.html',
  styleUrls: ['./buscador-compartido.component.css']
})
export class BuscadorCompartidoComponent<T> {  // Aquí se declara el tipo genérico T
  @Input() items: T[] = []; // Recibe la lista de elementos para buscar
  @Input() placeholder: string = 'Buscar...'; // Placeholder para el input
  @Input() searchProperty!: keyof T; // Propiedad del objeto a buscar
  @Output() searchResults = new EventEmitter<T[]>(); // Emite los resultados de la búsqueda

  searchQuery: string = '';

  buscar(): void {
    const query = this.searchQuery.trim().toLowerCase();
    
    if (query) {
      const results = this.items.filter(item => {
        const value = item[this.searchProperty];
        return String(value).toLowerCase().includes(query);
      });
      this.searchResults.emit(results);
    } else {
      this.searchResults.emit(this.items);  // Emitir todos los items si no hay búsqueda
    }
  }
  
}