import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AsyncPipe, CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetalleUsuarioComponent } from '../detalle-usuario/detalle-usuario.component';
import { BuscadorCompartidoComponent } from '../shared/buscador-compartido/buscador-compartido.component';
import { IVenta, IVentaAux } from '../../interfaces/IVenta';
import { VentasService } from '../../services/ventas.service';

@Component({
  selector: 'app-tipo-ventas',
  standalone: true,
  imports: [AsyncPipe, NgForOf, NgIf, FormsModule, DetalleUsuarioComponent, BuscadorCompartidoComponent, CommonModule],
  templateUrl: './tipo-ventas.component.html',
  styleUrl: './tipo-ventas.component.css'
})
export class TipoVentasComponent {
  resultadosBusqueda: IVentaAux[] = [];
  ventaSeleccionado$: Observable<IVentaAux> | null = null;
  tipoVentaSeleccionado: string = 'Fisica';

  constructor(private ventaService: VentasService) { }

  ngOnInit(): void {
    this.obtenerVentasPorTipo(this.tipoVentaSeleccionado);
  }

  obtenerVentasPorTipo(tipoVenta: string): void {
    this.ventaService.getVentasByTipo(tipoVenta).subscribe(
        (data: IVentaAux[]) => {
            this.resultadosBusqueda = data.map(venta => ({
                ...venta,
                usuario: {
                    idUsuario: venta.usuario.idUsuario,
                    nombreUsuario: venta.usuario.nombreUsuario || 'Nombre Desconocido',
                },
                detalleVentas: venta.detalleVentas.map(detalle => ({
                    ...detalle,
                    producto: detalle.producto || {
                        nombreProducto: 'Producto Desconocido',
                        precio: 0
                    }
                }))
            }));
        },
        (error) => {
            console.error('Error al obtener las ventas:', error);
        }
    );
}


  filtrarVentasPorTipo(): void {
    this.obtenerVentasPorTipo(this.tipoVentaSeleccionado);
  }

  trackById(index: number, venta: IVentaAux): number {
    return venta.idVenta || 0;
  }

  verDetalle(idVenta: number): void {
    // Lógica para ver los detalles de la venta
  }

  formatearListaProductos(detalleVentas: { cantidad: number, producto: { nombreProducto: string, precio: number } }[]): string {
    return detalleVentas.map(detalle => 
      `- ${detalle.cantidad} ${detalle.producto.nombreProducto} $${(detalle.cantidad * detalle.producto.precio).toFixed(2)}`
    ).join('<br>');
  }
}