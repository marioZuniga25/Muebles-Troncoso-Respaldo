import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IReceta } from '../interfaces/IReceta';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RecetaService {

  private _apiUrl = environment.endpoint;

  constructor(private http: HttpClient) {}

  getRecetas(): Observable<IReceta[]> {
    return this.http.get<IReceta[]>(`${this._apiUrl}receta/ListadoRecetas`);
  }

  getRecetaById(id: number): Observable<IReceta> {
    return this.http.get<IReceta>(`${this._apiUrl}receta/${id}`);
  }

  addReceta(request: IReceta): Observable<IReceta> {
    return this.http.post<IReceta>(`${this._apiUrl}receta/Agregar`, request);
  }

  updateReceta(id: number, request: IReceta): Observable<IReceta> {
    return this.http.put<IReceta>(`${this._apiUrl}receta/Modificar/${id}`, request);
  }

  deleteReceta(id: number): Observable<any> {
    return this.http.delete(`${this._apiUrl}receta/Eliminar/${id}`);
  }

  producirReceta(id: number, cantidad: number): Observable<any> {
    return this.http.post<any>(`${this._apiUrl}receta/ProcesarReceta/${id}/${cantidad}`, {});
  }
}
