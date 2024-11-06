import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProductosService } from '../services/productos/productos.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnChanges {
  @Input() isVisible: boolean = false;
  productos: any[] = [];
  searchQuery: string = '';

  constructor(private productosService: ProductosService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && this.isVisible) {
      this.buscarProductos();  // Carga todos los productos cuando el buscador se abre
    }
  }

  toggleBuscador(): void {
    this.isVisible = !this.isVisible;
  }

  cerrarBuscador(): void {
    this.isVisible = false;
  }

  buscarProductos(): void {
    this.productosService.getProductos(this.searchQuery.trim()).subscribe(
      (data) => {
        this.productos = data;
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }

  buscarProductosPalabras(): void {
    const query = this.searchQuery.trim();
    if (query.length > 2) {
      this.buscarProductos();
    } else if (query.length === 0) {
      this.productosService.getProductos('').subscribe(
        (data) => {
          this.productos = data;  // Vuelve a cargar todos los productos
        },
        (error) => {
          console.error('Error fetching products', error);
        }
      );
    } else {
      this.productos = []; // Limpiar resultados si no hay input
    }
  }
}
