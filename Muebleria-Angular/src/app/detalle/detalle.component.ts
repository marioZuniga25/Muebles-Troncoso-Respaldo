import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from '../services/productos/productos.service';
import { CommonModule } from '@angular/common';
import { BuscadorService } from '../services/buscador.service';
import { CarritoService, ProductoCarrito } from '../services/carrito/carrito.service';
import { IProductoResponse } from '../interfaces/IProductoResponse';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  producto!: IProductoResponse;
  cantidad: number = 1;
  precioConDescuento!: number;
  descuento!: number;
  tienePromocion: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productosService: ProductosService,
    private buscadorService: BuscadorService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      const id = idStr ? +idStr : null;
      const descuentoStr = this.route.snapshot.queryParamMap.get('descuento');
      const precioConDescuentoStr = this.route.snapshot.queryParamMap.get('precioConDescuento');

      // Verifica si hay promoción
      this.descuento = descuentoStr ? +descuentoStr : 0;
      this.precioConDescuento = precioConDescuentoStr ? +precioConDescuentoStr : 0;
      this.tienePromocion = this.descuento > 0 && this.precioConDescuento > 0;

      if (id !== null) {
        this.productosService.getProductoById(id).subscribe(producto => {
          if (producto) {
            this.producto = producto;
            this.buscadorService.closeBuscador();
          } else {
            console.error('Producto no encontrado');
          }
        });
      } else {
        console.error('El ID del producto es nulo o inválido');
      }
    });
  }
  
  agregarAlCarrito() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      Swal.fire({
        icon: 'warning',
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para agregar productos al carrito.',
        confirmButtonText: 'Ir al Login'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']); 
        }
      });
    } else {
      this.productosService.validarStock(this.producto.idProducto).subscribe(stockDisponible => {
        if (stockDisponible === 1) {
          const productoCarrito: ProductoCarrito = {
            id: this.producto.idProducto,
            nombre: this.producto.nombreProducto,
            precio: this.precioConDescuento, // Usa el precio con descuento
            cantidad: this.cantidad,
            imagen: this.producto.imagen,
            stock: this.producto.stock
          };
          this.carritoService.agregarAlCarrito(productoCarrito);
          Swal.fire('Éxito', 'Se agregó el producto al carrito.', 'success');
        } else {
          Swal.fire('Error', 'Este producto está agotado.', 'error');
        }
      });
    }
  }
}
