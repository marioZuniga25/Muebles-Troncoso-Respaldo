import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IContacto } from '../interfaces/IContactoResponse';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ContactoService {
  private apiUrl = `${environment.endpoint}Contacto`;

  constructor(private http: HttpClient) {}

  // Método para agregar un nuevo contacto
  agregarContacto(contacto: IContacto): Observable<IContacto> {
    return this.http.post<IContacto>(`${this.apiUrl}/Agregar`, contacto);
  }
}
