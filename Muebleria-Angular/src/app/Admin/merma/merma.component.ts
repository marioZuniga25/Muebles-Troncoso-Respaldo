import { Component } from '@angular/core';
import { IMerma } from '../../interfaces/IMerma';
import { MermaService } from '../../services/merma.service';
import Swal from 'sweetalert2';
import { IUnidadMedida } from '../../interfaces/IUnidadMedida';
import { tap } from 'rxjs';
import { IMateriaPrima } from '../../interfaces/IMateriaPrima';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-merma',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './merma.component.html',
  styleUrl: './merma.component.css'
})
export class MermaComponent {
  merma: IMerma[] = [];
  nuevaMerma = {
    idMerma: 0,
    nombre: '',
    fechaMerma: new Date(),
    idMateria: 0,
    cantidad: 0,
    UnidadMedida: '',
    causa: '',
    comentarios: '',
    idUsuario: 0
  };
  unidadesMedida: IUnidadMedida[] = [];
  materiasPrimas: IMateriaPrima[] = [];
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  modalAbierto: boolean = false;

  constructor(private mermaService: MermaService) { }

  ngOnInit(): void {
    this.getMermas();
    this.getUnidadesMedida();
    this.getMateriasPrimas();
  }

  getMermas(): void {
    this.mermaService.getList().subscribe(
      (data: IMerma[]) => {this.merma = data},
      
      (error) => Swal.fire('Error', 'Error al obtener las Mermas.', 'error')
    );
    
  }

  

  getUnidadesMedida() {
    this.mermaService.getUnidadesMedida().subscribe((data: IUnidadMedida[]) => {
      this.unidadesMedida = data;
    });
  }

  getMateriasPrimas() {
    this.mermaService.getMateriasPrimas().subscribe((data: IMateriaPrima[]) => {
      this.materiasPrimas = data;
    });
  }

  filtrarPorFecha(): void {
    // Verificar que ambas fechas estén seleccionadas
    if (!this.fechaInicio || !this.fechaFin) {
      Swal.fire('Error', 'Selecciona ambas fechas para filtrar.', 'error');
      return;
    }
  
    // Validar que la fecha de inicio no sea mayor a la fecha de fin
    if (this.fechaInicio > this.fechaFin) {
      Swal.fire('Error', 'La fecha de inicio no puede ser mayor que la fecha de fin.', 'error');
      return;
    }
  
    // Llamar al servicio para filtrar las mermas
    this.mermaService.filtrarMermas(this.fechaInicio, this.fechaFin).subscribe({
      next: (data) => {
        this.merma = data;
      },
      error: () => Swal.fire('Error', 'No se pudieron filtrar las mermas.', 'error')
    });
  }
  

  abrirModal(): void {
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.nuevaMerma = { ...this.nuevaMerma, cantidad: 0, causa: '', comentarios: '' };
  }

  guardarMerma(): void {
    
    this.mermaService.addMerma(this.nuevaMerma).subscribe({
      next: () => {
        Swal.fire('Guardado', 'Merma agregada correctamente.', 'success');
        this.getMermas();
        this.cerrarModal();
      },
      error: () => Swal.fire('Error', 'No se pudo guardar la merma.', 'error')
    });
  }
  

  eliminarMerma(idMerma: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.mermaService.deleteMerma(idMerma).subscribe({
          next: () => this.getMermas(),
          error: () => Swal.fire('Error', 'No se pudo eliminar la merma con id:'+idMerma, 'error')
        });
      }
    });
  }
}
