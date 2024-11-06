import { Component } from '@angular/core';
import { IMateriaPrima } from '../../interfaces/IMateriaPrima';
import { MateriaprimaService } from '../../services/materiaprima.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuscadorCompartidoComponent } from '../shared/buscador-compartido/buscador-compartido.component';
import { IUnidadMedida } from '../../interfaces/IUnidadMedida';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-materia-prima',
  standalone: true,
  imports: [CommonModule, FormsModule,BuscadorCompartidoComponent],
  templateUrl: './materia-prima.component.html',
  styleUrl: './materia-prima.component.css'
})
export class MateriaPrimaComponent {
  materiasPrimas: IMateriaPrima[] = [];
  unidadesMedida: IUnidadMedida[] = [];
  cantidadesCompra: { [idMateriaPrima: number]: number } = {};
  resultadosBusqueda: IMateriaPrima[] = []; // Propiedad para almacenar los resultados de la búsqueda
  selectedMateriaPrima: IMateriaPrima = {
    idMateriaPrima: 0,
    nombreMateriaPrima: '',
    descripcion: '',
    medida: '',
    precio: 0,
    stock: 0,
    idUnidad: 0
  };
  nuevaMateriaPrima: IMateriaPrima = {
    idMateriaPrima: 0,
    nombreMateriaPrima: '',
    descripcion: '',
    medida: '',
    precio: 0,
    stock: 0,
    idUnidad: 0
  };
  isResultLoaded = false;
  isUpdateFormActive = false;
  isModalOpen = false;
  isEditModalOpen = false;
  

  constructor(private _materiaPrimaService: MateriaprimaService) {
    this.getMateriasPrimas();
    
  }
  getUnidadesMedida() {
    return this._materiaPrimaService.getUnidadesMedida().pipe(
      tap(data => {
        this.unidadesMedida = data; // Almacena las unidades de medida
        console.log(this.unidadesMedida);
      })
    );
  }
  // Método para manejar los resultados de la búsqueda
  onSearchResults(resultados: IMateriaPrima[]): void {
    this.resultadosBusqueda = resultados;
  }
  getMateriasPrimas() {
    this.getUnidadesMedida().subscribe(() => { // Asegúrate de que las unidades se hayan cargado primero
      this._materiaPrimaService.getList().subscribe({
        next: (data) => {
          this.materiasPrimas = data.map(mp => {
            // Asocia la unidad de medida con cada materia prima
            const unidad = this.unidadesMedida.find(u => u.idUnidad === mp.idUnidad);
            return {
              ...mp,
              medida: unidad ? unidad.nombreUnidad : 'Sin unidad' // Asignar nombre de unidad o 'Sin unidad'
            };
          });
          this.resultadosBusqueda = this.materiasPrimas;
          this.isResultLoaded = true;
          console.log(this.materiasPrimas);
        },
        error: (e) => { console.log(e); }
      });
    });
  }
  
  openModal() {
    this.isModalOpen = true;
  }

  
  closeModal() {
    this.isModalOpen = false;
    this.isEditModalOpen = false;
    this.selectedMateriaPrima = {
      idMateriaPrima: 0,
      nombreMateriaPrima: '',
      descripcion: '',
      medida: '',
      precio: 0,
      stock: 0,
      idUnidad: 0
    };
  }

  openEditModal(materiaPrima: IMateriaPrima): void {
    this.selectedMateriaPrima = { ...materiaPrima }; 
    this.isEditModalOpen = true;
    console.log(this.selectedMateriaPrima);
  }

  addMateriaPrima() {
    console.log(this.nuevaMateriaPrima);
    this._materiaPrimaService.addMateriaPrima(this.nuevaMateriaPrima).subscribe({

      next:(data) => {
        
        

        this.nuevaMateriaPrima = {
          idMateriaPrima: 0,
          nombreMateriaPrima: '',
          descripcion: '',
          medida: '',
          precio: 0,
          stock: 0,
          idUnidad: 0
        };
        this.closeModal();
        this.getMateriasPrimas();
        
      }, 
      error:(e) =>{console.log(e)}
    
    });
  }

  saveChanges(): void {
    if (this.selectedMateriaPrima) {
      console.log(this.selectedMateriaPrima);
        this._materiaPrimaService.updateMateriaPrima(this.selectedMateriaPrima).subscribe({
          next:(data) => {

            this.closeModal();
            this.getMateriasPrimas();

          }, error:(e) => {console.log(e);}
        });
      } 
  }

    deleteMateria(){
      this._materiaPrimaService.deleteMateriaPrima(this.selectedMateriaPrima).subscribe({
        next:(data) => {
          this.closeModal();
          this.getMateriasPrimas();
        }, error:(e) => {console.log(e);}
      });
    }
  

}
