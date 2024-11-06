import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Importa Router
import { VentasService } from '../services/ventas.service';
import { IDetalleVenta } from '../interfaces/IDetalleVenta';
import { IVenta } from '../interfaces/IVenta';
import { CommonModule } from '@angular/common';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-gracias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gracias.component.html',
  styleUrl: './gracias.component.css'
})
export class GraciasComponent implements OnInit {
  venta: IVenta | undefined;
  detallesVenta: IDetalleVenta[] = [];
  total: number = 0;

  constructor(
    private route: ActivatedRoute,
    private ventasService: VentasService,
    private router: Router // Inyecta el Router
  ) {}

  ngOnInit(): void {
    // Obtén el ID de la venta desde la URL
    const encryptedId = this.route.snapshot.paramMap.get('id');
    const secretKey = 'tu_clave_secreta';
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId!), secretKey);
    const idVenta = parseInt(bytes.toString(CryptoJS.enc.Utf8), 10);
    
    // Carga los datos de la venta
    this.ventasService.getVentaById(idVenta).subscribe(
      (venta: IVenta) => {
        this.venta = venta;
        this.total = venta.total;

        // Carga los detalles de la venta
        this.ventasService.getDetalleVentaByVentaId(idVenta).subscribe(
          (detalles: IDetalleVenta[]) => {
            this.detallesVenta = detalles;
            console.log(this.detallesVenta);

            // Espera 3 segundos antes de redirigir
            setTimeout(() => {
              this.router.navigate(['/catalogo']); // Redirige al catálogo
            }, 3000); // 3000 milisegundos = 3 segundos
          },
          (error) => {
            console.error('Error al cargar los detalles de la venta', error);
          }
        );
      },
      (error) => {
        console.error('Error al cargar la venta', error);
      }
    );
  }
}
