import { Injectable } from '@angular/core';
import { IMateriaPrima } from '../interfaces/IMateriaPrima';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {IUnidadMedida} from '../interfaces/IUnidadMedida';
import { IMerma } from '../interfaces/IMerma';

@Injectable({
  providedIn: 'root'
})
export class MermaService {
  private _endpoint: string = environment.endpoint;
  private _apiUrlMP: string = this._endpoint + 'MateriasPrimas/';
  private _apiUrlM: string = this._endpoint + 'Merma/';


  constructor(private _http: HttpClient) {}

    
      // MateriaprimaService
    getList(): Observable<IMerma[]> {
      return this._http.get<IMerma[]>(`${this._apiUrlM}listaMermas`);
    }
    
    filtrarMermas(fechaInicio: Date, fechaFin: Date): Observable<IMerma[]> {
      // Verificar que ambas fechas sean instancias de Date
      if (!(fechaInicio instanceof Date)) {
        fechaInicio = new Date(fechaInicio);  // Convertir a Date si no lo es
      }
      if (!(fechaFin instanceof Date)) {
        fechaFin = new Date(fechaFin);  // Convertir a Date si no lo es
      }
    
      // Obtener el año, mes y día de las fechas
      const fechaInicioStr = `${fechaInicio.getFullYear()}-${(fechaInicio.getMonth() + 1).toString().padStart(2, '0')}-${fechaInicio.getDate().toString().padStart(2, '0')}`;
      const fechaFinStr = `${fechaFin.getFullYear()}-${(fechaFin.getMonth() + 1).toString().padStart(2, '0')}-${fechaFin.getDate().toString().padStart(2, '0')}`;
    
      // Convertir las fechas a strings en el formato 'YYYY-MM-DD'
      const params = new HttpParams()
        .set('fechaInicio', fechaInicioStr)
        .set('fechaFin', fechaFinStr);
    
      return this._http.get<IMerma[]>(`${this._apiUrlM}filtrarMermas`, { params });
    }
    
    
  
    getMateriasPrimas(){
      return this._http.get<IMateriaPrima[]>(`${this._apiUrlMP}ListarMateriasPrimas`);
    }

    getUnidadesMedida(): Observable<IUnidadMedida[]> {
      return this._http.get<IUnidadMedida[]>(`${this._endpoint}UnidadMedida`)
    }

    addMerma(request: IMerma): Observable<number> {
      return this._http.post<number>(`${this._apiUrlM}Agregar`, request);
    }

    // updateMateriaPrima(request: IMerma): Observable<void>{
    //   return this._http.put<void>( `${this._apiUrlMP}ModificarMateriaP?id=${request.idMateria}`, request);
    // }

    deleteMerma(idMerma: number): Observable<void>{
      return this._http.delete<void>( `${this._apiUrlM}Eliminar/${idMerma}`);
    }

    /*filtrarProductos(request: string): Observable<IProducto[]> {
      return this._http.get<IProducto[]>(`${this._apiUrlP}FiltrarProductos?term=${request}`);
    }*/

}
