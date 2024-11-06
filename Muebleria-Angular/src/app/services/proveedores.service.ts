import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { IProveedorResponse, IProveedorRequest } from '../interfaces/IProveedorResponse';
import { environment } from '../../environments/environment.development';
import { IUnidadMedida } from '../interfaces/IUnidadMedida';
@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  apiUrl: string = environment.endpoint;

  constructor(private http: HttpClient) { }

  // Obtener todos los proveedores
  getProveedores(): Observable<IProveedorResponse[]> {
    return this.http.get<IProveedorResponse[]>(`${this.apiUrl}proveedores`)
      .pipe(
        retry(1), 
        catchError(this.handleError)
      );
  }
  getUnidadesMedida(): Observable<IUnidadMedida[]> {
    return this.http.get<IUnidadMedida[]>(`${this.apiUrl}UnidadMedida`)
    .pipe(
      retry(1), 
      catchError(this.handleError)
    );
  }

  // Obtener un proveedor por su ID
  getProveedor(id: number): Observable<IProveedorResponse> {
    const url = `${this.apiUrl}proveedores/${id}`;
    return this.http.get<IProveedorResponse>(url)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Crear un nuevo proveedor
  addProveedor(proveedor: IProveedorRequest): Observable<IProveedorResponse> {
    return this.http.post<IProveedorResponse>(`${this.apiUrl}proveedores`, proveedor, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar un proveedor existente
  // En el servicio ProveedoresService
    updateProveedor(id: number, proveedor: IProveedorRequest): Observable<IProveedorResponse> {
      return this.http.put<IProveedorResponse>(`/api/Proveedores/${id}`, proveedor);
    }

  // Eliminar un proveedor
  deleteProveedor(id: number): Observable<any> {
    const url = `${this.apiUrl}proveedores/${id}`;
    return this.http.delete(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
 

  // Manejo de errores
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
}
