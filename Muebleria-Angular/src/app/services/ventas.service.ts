import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProducto } from '../interfaces/IProducto';
import { IVenta, IVentaAux } from '../interfaces/IVenta';
import { IDetalleVenta } from '../interfaces/IDetalleVenta';
import { IProductoResponse } from '../interfaces/IProductoResponse';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  

  private _endpoint: string = environment.endpoint;
  private _apiUrlP: string = this._endpoint + 'Producto/';
  private _apiUrlV: string = this._endpoint + 'Ventas/';


  constructor(private _http: HttpClient) {}

    
    getList(): Observable<IProductoResponse[]>{
      return this._http.get<IProductoResponse[]>( `${this._apiUrlP}ListadoProductos`);
    }

    addVentaOnline(request: IVenta): Observable<number> {
      return this._http.post<number>(`${this._apiUrlV}AgregarVentaOnline`, request);
    }
    addVentaFisica(request: IVenta): Observable<number> {
      return this._http.post<number>(`${this._apiUrlV}AgregarVentaFisica`, request);
    }

    addDetalleVenta(request: IDetalleVenta[]): Observable<void> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      return this._http.post<void>(`${this._apiUrlV}AgregarDetalleVenta`, request);
    }
    // Método para obtener una venta por ID
    getVentaById(id: number): Observable<IVenta> {
      return this._http.get<IVenta>(`${this._apiUrlV}${id}`);
    }

    // Método para obtener los detalles de una venta por ID de venta
    getDetalleVentaByVentaId(idVenta: number): Observable<IDetalleVenta[]> {
      return this._http.get<IDetalleVenta[]>(`${this._apiUrlV}${idVenta}/detalles`);
    }


    filtrarProductos(request: string): Observable<IProductoResponse[]> {
      return this._http.get<IProductoResponse[]>(`${this._apiUrlP}FiltrarProductos?term=${request}`);
    }
    getVentasByTipo(tipoVenta: string): Observable<IVentaAux[]> {
      return this._http.get<IVentaAux[]>(`${this._apiUrlV}GetVentasByTipo/${tipoVenta}`);
    }
  

    /*search(name: string): Observable<IProducto[]>{
      return this._http.get<IProducto[]>( `${this._apiUrl}search?name=${name}`);
    }*/
}
