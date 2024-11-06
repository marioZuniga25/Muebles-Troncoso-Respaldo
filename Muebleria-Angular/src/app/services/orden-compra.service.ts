import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrdenCompraService {
  private _endpoint: string = environment.endpoint;
  private apiUrl: string = this._endpoint + 'OrdenCompra';

  constructor(private http: HttpClient) { }

  // Crear una nueva orden de compra
  crearOrdenCompra(ordenCompra: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/CrearOrdenCompra`, ordenCompra);
  }

  // Obtener listado de órdenes de compra
  obtenerOrdenesCompra(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ListadoOrdenes`);
  }
}
