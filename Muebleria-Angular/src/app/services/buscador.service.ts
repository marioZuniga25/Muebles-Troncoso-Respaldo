import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscadorService {
  private buscadorVisible = new BehaviorSubject<boolean>(false);

  constructor() {}

  toggleBuscador(): void {
    this.buscadorVisible.next(!this.buscadorVisible.value);
  }

  closeBuscador(): void {
    this.buscadorVisible.next(false);
  }

  getBuscadorState() {
    return this.buscadorVisible.asObservable();
  }
}
