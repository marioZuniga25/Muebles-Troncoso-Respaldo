import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CarritoService, ProductoCarrito } from '../services/carrito/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit{
  carrito: ProductoCarrito[] = [];
  mostrarBag$ = this.carritoService.mostrarBag$;

  constructor(private carritoService: CarritoService) {}
  toggleBag() {
    this.carritoService.cargarCarrito(); 
    this.carritoService.toggleBag();
  }
  ngOnInit(): void {
    this.carrito = this.carritoService.obtenerCarrito();
  }
  eliminarDelCarrito(productoId: number) {
    this.carritoService.eliminarDelCarrito(productoId);
    this.carrito = this.carritoService.obtenerCarrito(); // Actualiza la vista
  }
  incrementarCantidad(productoId: number, maxStock: number) {
    this.carritoService.incrementarCantidad(productoId, maxStock);
    this.carrito = this.carritoService.obtenerCarrito(); // Actualiza la vista
  }
  
  decrementarCantidad(productoId: number) {
    this.carritoService.decrementarCantidad(productoId);
    this.carrito = this.carritoService.obtenerCarrito(); // Actualiza la vista
  }
}
