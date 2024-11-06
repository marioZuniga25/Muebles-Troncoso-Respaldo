// pedidos.component.ts

import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { CommonModule } from '@angular/common';
import { IPedidos, IPedidosResponse } from '../../interfaces/IPedidos';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit {
  pedidos: IPedidosResponse[] = [];
  pedidoActual: IPedidosResponse | null = null;
  isModalOpen: boolean = false;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.pedidoService.getPedidos().subscribe(
      (data: IPedidosResponse[]) => {
        this.pedidos = data;
      },
      (error) => {
        console.error('Error al obtener los pedidos', error);
      }
    );
  }

  abrirModal(pedido: IPedidosResponse): void {
    this.pedidoActual = pedido;
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
  }

  enviarPedido(id: number): void {
    // Encontrar el pedido que se va a actualizar
    const pedidoActualizadoResponse: IPedidosResponse = this.pedidos.find(p => p.idPedido === id)!;

    // Convertir IPedidosResponse a IPedidos
    const pedidoActualizado: IPedidos = {
        idPedido: pedidoActualizadoResponse.idPedido,
        idVenta: pedidoActualizadoResponse.idVenta,
        nombre: pedidoActualizadoResponse.nombre,
        apellidos: pedidoActualizadoResponse.apellidos,
        telefono: pedidoActualizadoResponse.telefono,
        correo: pedidoActualizadoResponse.correo,
        calle: pedidoActualizadoResponse.calle,
        numero: pedidoActualizadoResponse.numero,
        colonia: pedidoActualizadoResponse.colonia,
        ciudad: pedidoActualizadoResponse.ciudad,
        estado: pedidoActualizadoResponse.estado,
        codigoPostal: pedidoActualizadoResponse.codigoPostal,
        estatus: 'enviado',
        idUsuario: 0, // Aquí asignas el valor adecuado para idUsuario
        idTarjeta: 0, // Aquí asignas el valor adecuado para idTarjeta
    };

    // Enviar la solicitud de actualización
    this.pedidoService.updatePedido(id, pedidoActualizado).subscribe(
      () => {
        console.log('Pedido actualizado con éxito');
        this.cargarPedidos(); // Volver a cargar la lista de pedidos para reflejar los cambios
      },
      (error) => {
        console.error('Error al actualizar el pedido', error);
      }
    );
}

}
