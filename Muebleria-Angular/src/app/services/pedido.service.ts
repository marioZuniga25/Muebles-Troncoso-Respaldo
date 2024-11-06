import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPedidos, IPedidosResponse } from '../interfaces/IPedidos';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private apiUrl = 'http://localhost:5194/api/Pedido'; // Define tu URL base para las APIs
  constructor(private http: HttpClient) {}

  // Obtener todos los pedidos
  getPedidos(): Observable<IPedidosResponse[]> {
    return this.http.get<IPedidosResponse[]>(this.apiUrl);
  }

  // Agregar un nuevo pedido
  guardarPedido(pedido: IPedidos): Observable<IPedidos> {
    return this.http.post<IPedidos>(this.apiUrl, pedido);
  }

  // Actualizar el estatus de un pedido
  updatePedido(id: number, pedido: IPedidos): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, pedido);
  }

}
