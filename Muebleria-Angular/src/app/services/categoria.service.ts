import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ICategoriaResponse } from '../interfaces/ICategoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = `${environment.endpoint}Categorias`;

  constructor(private http: HttpClient) { }

  // Obtener todas las categorías
  getCategorias(): Observable<ICategoriaResponse[]> {
    return this.http.get<ICategoriaResponse[]>(this.apiUrl);
  }

  // Obtener una categoría por ID
  getCategoriaById(id: number): Observable<ICategoriaResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ICategoriaResponse>(url);
  }

  // Agregar una nueva categoría
  addCategoria(categoria: ICategoriaResponse): Observable<ICategoriaResponse> {
    return this.http.post<ICategoriaResponse>(this.apiUrl, categoria);
  }

  // Modificar una categoría existente
  updateCategoria(id: number, categoria: ICategoriaResponse): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, categoria);
  }

  // Eliminar una categoría
  deleteCategoria(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
