import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductosService } from '../../services/productos/productos.service';
import { IReceta, IRecetaDetalle } from '../../interfaces/IReceta';
import { IProductoResponse } from '../../interfaces/IProductoResponse';
import { IMateriaPrima } from '../../interfaces/IMateriaPrima';
import Swal from 'sweetalert2';
import { RecetaService } from '../../services/recetas.service';
import { MateriaprimaService } from '../../services/materiaprima.service';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { BuscadorCompartidoComponent } from "../shared/buscador-compartido/buscador-compartido.component";

@Component({
  selector: 'app-receta',
  imports: [FormsModule, NgClass, NgFor, NgIf, BuscadorCompartidoComponent],
  standalone: true,
  templateUrl: './produccion.component.html',
  styleUrls: ['./produccion.component.css']
})
export class ProduccionComponent implements OnInit {

  @ViewChild('detallesContainer') detallesContainer!: ElementRef;

  recetas: IReceta[] = [];
  resultadosBusqueda: IReceta[] = [];
  productos: IProductoResponse[] = [];
  materiasPrimas: IMateriaPrima[] = [];
  recetaActual: IReceta = {
    idReceta: 0,
    idProducto: 0,
    detalles: []
  };
  isModalOpen = false;
  isModalVerDetallesOpen = false;

  constructor(private recetaService: RecetaService,
    private productosService: ProductosService,
    private materiaPrimaService: MateriaprimaService) { }

  ngOnInit(): void {
    this.getRecetas();
    this.getProductos();
    this.getMateriasPrimas();
  }

  producirReceta(recetaId: number): void {
    Swal.fire({
      title: '¿Cuántos productos quieres producir?',
      input: 'number',
      inputAttributes: {
        min: '1',
        step: '1'
      },
      showCancelButton: true,
      confirmButtonText: 'Producir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const cantidad = Number(result.value);

        if (cantidad > 0) {
          this.recetaService.producirReceta(recetaId, cantidad).subscribe(
            response => {
              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "success",
                title: "Productos hechos"
              });
            },
            error => {
              Swal.fire('Error', error.error || 'Error al procesar la receta', 'error');
              console.error('Error al procesar la receta:', error);
            }
          );
        } else {
          Swal.fire('Error', 'Debes ingresar un número válido.', 'error');
        }
      }
    });
  }


  onSearchResults(resultados: IProductoResponse[]): void {

    this.resultadosBusqueda = this.recetas.filter(receta =>
      resultados.some(producto => producto.idProducto === receta.idProducto)
    );
  }



  getRecetas(): void {
    this.recetaService.getRecetas().subscribe(
      (data: IReceta[]) => {
        this.recetas = data;
        this.resultadosBusqueda = this.recetas;
      },
      error => Swal.fire('Error', 'Error al obtener recetas', 'error')
    );
  }


  getProductos(): void {
    this.productosService.getAllProductos().subscribe(
      (data: IProductoResponse[]) => this.productos = data,
      error => Swal.fire('Error', 'Error al obtener productos', 'error')
    );
  }

  getMateriasPrimas(): void {
    this.materiaPrimaService.getList().subscribe(
      (data: IMateriaPrima[]) => this.materiasPrimas = data,
      error => Swal.fire('Error', 'Error al obtener materias primas', 'error')
    );
  }

  agregarDetalle(): void {
    this.recetaActual.detalles.push({
      idRecetaDetalle: 0,
      idMateriaPrima: 0,
      cantidad: 1
    });

    // Hacer scroll al final después de agregar un nuevo detalle
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
  }

  eliminarDetalle(index: number): void {
    this.recetaActual.detalles.splice(index, 1);
  }

  validarFormulario(): boolean {
    if (this.recetaActual.idProducto === 0) {
      Swal.fire('Error', 'Debe seleccionar un producto', 'error');
      return false;
    }

    if (this.recetaActual.detalles.length === 0) {
      Swal.fire('Error', 'Debe agregar al menos un detalle a la receta', 'error');
      return false;
    }

    for (let detalle of this.recetaActual.detalles) {
      if (detalle.idMateriaPrima === 0 || detalle.cantidad <= 0 || isNaN(detalle.cantidad)) {
        Swal.fire('Error', 'Todos los detalles deben estar correctamente completados', 'error');
        return false;
      }
    }

    return true;
  }

  onSubmit(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.recetaActual.idProducto = parseInt(this.recetaActual.idProducto.toString(), 10);
    this.recetaActual.detalles = this.recetaActual.detalles.map(detalle => ({
      idMateriaPrima: parseInt(detalle.idMateriaPrima.toString(), 10),
      cantidad: detalle.cantidad
    }));

    if (this.recetaActual.idReceta) {
      this.recetaService.updateReceta(this.recetaActual.idReceta, this.recetaActual).subscribe(
        () => {
          this.getRecetas();
          this.cerrarModal();
          Swal.fire('Éxito', 'Receta modificada exitosamente', 'success');
        },
        error => Swal.fire('Error', 'Error al modificar receta', 'error')
      );
    } else {
      this.recetaService.addReceta(this.recetaActual).subscribe(
        () => {
          this.getRecetas();
          this.cerrarModal();
          Swal.fire('Éxito', 'Receta agregada exitosamente', 'success');
        },
        error => {
          if (error.error === 'Ya existe una receta para este producto.') {
            Swal.fire('Error', 'Ya existe una receta para este producto', 'error');
          } else {
            Swal.fire('Error', 'Error al agregar receta', 'error');
          }
        }
      );
    }
  }

  scrollToBottom(): void {
    try {
      this.detallesContainer.nativeElement.scrollTop = this.detallesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling:', err);
    }
  }

  abrirModalAgregar(): void {
    this.resetFormulario();
    this.isModalOpen = true;
  }

  abrirModalModificar(receta: IReceta): void {
    this.recetaActual = { ...receta };
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
  }

  resetFormulario(): void {
    this.recetaActual = {
      idReceta: 0,
      idProducto: 0,
      detalles: []
    };
  }

  eliminarReceta(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.recetaService.deleteReceta(id).subscribe(
          (response: any) => {
            if (response.mensaje === 'Receta eliminada correctamente') {
              this.recetas = this.recetas.filter(r => r.idReceta !== id);
              Swal.fire('Eliminado', response.mensaje, 'success');
            } else {
              Swal.fire('Error', 'Error al eliminar receta.', 'error');
            }
          },
          error => {
            Swal.fire('Error', 'Error al eliminar receta.', 'error');
          }
        );
      }
    });
  }

  getProductoNombre(idProducto: number): string {
    const producto = this.productos.find(p => p.idProducto === idProducto);
    return producto ? producto.nombreProducto : 'Desconocido';
  }

  getMateriaPrimaNombre(idMateriaPrima: number): string {
    const materiaPrima = this.materiasPrimas.find(m => m.idMateriaPrima === idMateriaPrima);
    return materiaPrima ? materiaPrima.nombreMateriaPrima : 'Desconocido';
  }

  getProductoImagen(idProducto: number): string {
    const producto = this.productos.find(p => p.idProducto === idProducto);
    return producto ? producto.imagen : 'default-image-path'; // Cambia 'default-image-path' por una imagen predeterminada si el producto no tiene imagen
  }

  getProductoDescripcion(idProducto: number): string {
    const producto = this.productos.find(p => p.idProducto === idProducto);
    return producto ? producto.descripcion : 'Sin descripción';
  }

  abrirModalVerDetalles(receta: IReceta): void {
    this.recetaActual = { ...receta };
    this.isModalVerDetallesOpen = true;
  }

  cerrarModalVerDetalles(): void {
    this.isModalVerDetallesOpen = false;
  }

}
