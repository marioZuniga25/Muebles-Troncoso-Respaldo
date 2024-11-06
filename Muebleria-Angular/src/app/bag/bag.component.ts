import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CarritoService, ProductoCarrito } from '../services/carrito/carrito.service';

@Component({
  selector: 'app-bag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bag.component.html',
  styleUrl: './bag.component.css'
})
export class BagComponent implements OnInit {
  carrito: ProductoCarrito[] = [];
  subtotal: number = 0;
  total: number = 0;

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    this.cargarCarrito();
    this.calcularTotales();
  }

  cargarCarrito() {
    this.carrito = this.carritoService.obtenerCarrito();
  }

  calcularTotales() {
    this.subtotal = this.carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    this.total = this.subtotal; // Aquí puedes sumar impuestos o descuentos si es necesario
  }
}