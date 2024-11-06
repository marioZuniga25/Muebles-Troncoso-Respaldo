import { Injectable } from '@angular/core';
import { IMateriaPrima } from '../interfaces/IMateriaPrima';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {IUnidadMedida} from '../interfaces/IUnidadMedida';

@Injectable({
  providedIn: 'root'
})
export class MateriaprimaService {

  private _endpoint: string = environment.endpoint;
  private _apiUrlMP: string = this._endpoint + 'MateriasPrimas/';
  private _apiUrlV: string = this._endpoint + 'Ventas/';


  constructor(private _http: HttpClient) {}

    
      // MateriaprimaService
  getList(): Observable<IMateriaPrima[]> {
    return this._http.get<IMateriaPrima[]>(`${this._apiUrlMP}ListarMateriasPrimas`);
  }

    getUnidadesMedida(): Observable<IUnidadMedida[]> {
      return this._http.get<IUnidadMedida[]>(`${this._endpoint}UnidadMedida`)
    }

    addMateriaPrima(request: IMateriaPrima): Observable<number> {
      return this._http.post<number>(`${this._apiUrlMP}AgregarMateriaP`, request);
    }

    updateMateriaPrima(request: IMateriaPrima): Observable<void>{
      return this._http.put<void>( `${this._apiUrlMP}ModificarMateriaP?id=${request.idMateriaPrima}`, request);
    }

    deleteMateriaPrima(request: IMateriaPrima): Observable<void>{
      return this._http.delete<void>( `${this._apiUrlMP}EliminarMateriaP/${request.idMateriaPrima}`);
    }

    /*filtrarProductos(request: string): Observable<IProducto[]> {
      return this._http.get<IProducto[]>(`${this._apiUrlP}FiltrarProductos?term=${request}`);
    }*/

}
