import { Component, OnInit } from '@angular/core';
import { IProductoResponse, IProductoRequest } from '../../interfaces/IProductoResponse';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { ProductosService } from '../../services/productos/productos.service';
import { ICategoriaResponse } from '../../interfaces/ICategoria';
import { CategoriaService } from '../../services/categoria.service';
import { BuscadorCompartidoComponent } from '../shared/buscador-compartido/buscador-compartido.component';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [NgForOf, NgClass, FormsModule, NgIf, BuscadorCompartidoComponent],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  productos: IProductoResponse[] = [];
  categorias: ICategoriaResponse[] = [];
  resultadosBusqueda: IProductoResponse[] = [];
  isModalOpen: boolean = false;
  esModificacion: boolean = false;
  productoActual: IProductoResponse = {
    idProducto: 0,
    idCategoria: 0,
    idInventario: 0,
    nombreProducto: '',
    nombreCategoria: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagen: ''
  };
  imagenInput: File | null = null;

  constructor(private productosService: ProductosService, private categoriaService: CategoriaService) { }

  ngOnInit(): void {
    this.getProductos();
    this.getCategorias();
  }

  onSubmit(): void {
    if (this.validateForm()) {
      const productoRequest = this.mapToRequest(this.productoActual);
      
      if (this.esModificacion) {
        this.modificarProducto(productoRequest);
      } else {
        this.guardarProducto(productoRequest);
      }
    }
  }

  validateForm(): boolean {
    if (!this.productoActual.nombreProducto || this.productoActual.nombreProducto.trim().length === 0) {
      Swal.fire('Error', 'El nombre del producto es obligatorio.', 'error');
      return false;
    }
    if (!this.productoActual.descripcion || this.productoActual.descripcion.trim().length === 0) {
      Swal.fire('Error', 'La descripción del producto es obligatoria.', 'error');
      return false;
    }
    if (this.productoActual.precio <= 0) {
      Swal.fire('Error', 'El precio debe ser un valor positivo.', 'error');
      return false;
    }
    if (this.productoActual.stock < 0) {
      Swal.fire('Error', 'El stock no puede ser negativo.', 'error');
      return false;
    }
    if (!this.productoActual.idCategoria || this.productoActual.idCategoria === 0) {
      Swal.fire('Error', 'Debe seleccionar una categoría.', 'error');
      return false;
    }
    return true;
  }

  getProductos(): void {
    this.productosService.getAllProductos().subscribe(
      (data: IProductoResponse[]) => {
        this.productos = data;
        this.resultadosBusqueda = this.productos;
      },
      (error) => {
        Swal.fire('Error', 'Error al obtener los productos.', 'error');
      }
    );
  }

  getCategorias(): void {
    this.categoriaService.getCategorias().subscribe(
      (data: ICategoriaResponse[]) => {
        this.categorias = data;
      },
      (error) => {
        Swal.fire('Error', 'Error al obtener las categorías.', 'error');
      }
    );
  }

  onSearchResults(resultados: IProductoResponse[]): void {
    this.resultadosBusqueda = resultados;
  }

  modificarProducto(request: IProductoRequest): void {
    this.productosService.updateProducto(this.productoActual.idProducto, request).subscribe(
        (data: IProductoResponse) => {
            const index = this.productos.findIndex(p => p.idProducto === data.idProducto);
            if (index !== -1) {
                this.productos[index] = data;
                this.resultadosBusqueda = [...this.productos];
            }
            this.cerrarModal();
            this.resetFormulario();
            Swal.fire('Éxito', 'Producto modificado exitosamente.', 'success');
        },
        error => {
            Swal.fire('Error', 'Error al modificar producto.', 'error');
        }
    );
}


  guardarProducto(request: IProductoRequest): void {
    if (this.productoActual.imagen && this.productoActual.imagen.startsWith('data:image')) {
        request.imagen = this.productoActual.imagen;
    } else {
        request.imagen = '';
    }

    console.log('Datos del producto a enviar:', request);

    this.productosService.addProducto(request).subscribe(
        data => {
            this.productos.push(this.mapToResponse(data));
            this.resultadosBusqueda = this.productos;
            this.cerrarModal();
            this.resetFormulario();
            Swal.fire('Éxito', 'Producto agregado exitosamente.', 'success');
        },
        error => {
            console.error('Error al agregar producto:', error);
            Swal.fire('Error', 'Error al agregar producto.', 'error');
        }
    );
}

  

  eliminarProducto(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productosService.deleteProducto(id).subscribe(
          (response: any) => {
            if (response && response.mensaje === 'Producto eliminado correctamente') {
              this.productos = this.productos.filter(p => p.idProducto !== id);
              this.resultadosBusqueda = this.productos;
              Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
            } else {
              Swal.fire('Error', 'Respuesta inesperada del servidor.', 'error');
            }
          },
          error => {
            Swal.fire('Error', 'Error al eliminar producto.', 'error');
          }
        );
      }
    });
  }
  

  abrirModalAgregar(): void {
    this.resetFormulario();
    this.esModificacion = false;
    this.isModalOpen = true;
  }

  abrirModalModificar(producto: IProductoResponse): void {
    this.productoActual = { ...producto };
    this.esModificacion = true;
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
  }

  resetFormulario(): void {
    this.productoActual = {
      idProducto: 0,
      idCategoria: 0,
      idInventario: 0,
      nombreProducto: '',
      nombreCategoria: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      imagen: ''
    };
    this.imagenInput = null;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.productoActual.imagen = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  mapToRequest(producto: IProductoResponse): IProductoRequest {
    return {
      idProducto: producto.idProducto,
      idCategoria: producto.idCategoria,
      idInventario: producto.idInventario,
      nombreProducto: producto.nombreProducto,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      imagen: producto.imagen,
      nombreCategoria: producto.nombreCategoria
    };
  }

  mapToResponse(producto: IProductoRequest): IProductoResponse {
    return {
      idProducto: producto.idProducto,
      idCategoria: producto.idCategoria,
      idInventario: producto.idInventario,
      nombreProducto: producto.nombreProducto,
      nombreCategoria: this.categorias.find(c => c.idCategoria === producto.idCategoria)?.nombreCategoria || '',
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      imagen: producto.imagen
    };
  }
}
