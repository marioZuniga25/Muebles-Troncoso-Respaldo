import { Component, OnInit } from '@angular/core';
import { OrdenCompraService } from '../../services/orden-compra.service';
import { MateriaprimaService } from '../../services/materiaprima.service';
import { ProveedoresService } from '../../services/proveedores.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IProveedorResponse } from '../../interfaces/IProveedorResponse';
import { IMateriaPrima } from '../../interfaces/IMateriaPrima';
import { User } from '../../interfaces/AuthResponse';
import { AuthService } from '../../services/auth.service';
@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-compras-materias-primas',
  templateUrl: './compras-materias-primas.component.html',
  styleUrls: ['./compras-materias-primas.component.css']
})
export class ComprasMateriasPrimasComponent implements OnInit {
  ordenesCompra: any[] = [];
  user: User | null = null;
  ordenSeleccionada: any;
  selectedProveedor: IProveedorResponse | null = null;
  selectedMateriaPrima: IMateriaPrima | null = null;
  proveedores: any[] = []; // Lista de proveedores
  materiasPrimas: IMateriaPrima[] = []; // Lista de materias primas
  materiasPrimasOriginales: IMateriaPrima[] = []; // Guardar las materias primas originales
  precioTotal: number = 0; // Precio total de la compra
  detallesOrdenCompra: { idMateriaPrima: number, cantidad: number, precioUnitario: number }[] = []; fechaCompra: Date = new Date();
  nuevaOrdenCompra = {
    idProveedor: null as number | null,
    idMateriaPrima: null as number | null,
    precioUnitario: 0,
    cantidad: 0
  };
  isModalOpen = false;

  constructor(
    private ordenCompraService: OrdenCompraService,
    private materiaPrimaService: MateriaprimaService,
    private proveedorService: ProveedoresService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.obtenerOrdenes();
    this.cargarProveedores();
    this.cargarMateriasPrimas();
    this.user = this.authService.getUser();
  }
  // Modal para agregar un proveedor
  abrirModalOrden(): void {
    this.resetFormulario();
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
  }
  resetFormulario(): void {
    this.nuevaOrdenCompra = {
      idProveedor: null,
      idMateriaPrima: null,
      cantidad: 0,
      precioUnitario: 0
    };
    this.selectedProveedor = null;
    this.selectedMateriaPrima = null;
    this.precioTotal = 0; // Reinicia el precio total
  }

  // Obtener todas las órdenes de compra
  obtenerOrdenes() {
    this.ordenCompraService.obtenerOrdenesCompra().subscribe(data => {
      this.ordenesCompra = data;
      console.log("El usuario es: ", this.user);
    });
  }

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe(data => {
      this.proveedores = data;
      console.log("Proveedores cargados:", this.proveedores);
    });
  }


  cargarMateriasPrimas() {
    this.materiaPrimaService.getList().subscribe(data => {
      this.materiasPrimas = data;
      console.log("Materias primas cargadas:", this.materiasPrimas);
      this.materiasPrimasOriginales = [...data]; // Guardar copia de las materias primas originales
    });
  }

  onProveedorChange() {
    console.log("Proveedor seleccionado:", this.selectedProveedor);
    // Filtra las materias primas según el proveedor seleccionado
    if (this.selectedProveedor) {
      const materiasDelProveedor = this.selectedProveedor.nombresMateriasPrimas || [];
      this.materiasPrimas = this.materiasPrimasOriginales.filter(mp =>
        materiasDelProveedor.includes(mp.nombreMateriaPrima)
      );
    } else {
      // Si no hay proveedor seleccionado, restaurar la lista completa de materias primas
      this.materiasPrimas = this.materiasPrimasOriginales;
    }
  }



  onMateriaPrimaChange() {
    if (this.selectedMateriaPrima) {
      this.proveedores = this.proveedores.filter(proveedor =>
        proveedor.nombresMateriasPrimas && proveedor.nombresMateriasPrimas.includes(this.selectedMateriaPrima?.nombreMateriaPrima)
      );
      this.calcularPrecioTotal()
      console.log("Materia prima seleccionada:", this.selectedMateriaPrima);
    } else {
      // Restaurar la lista original de proveedores si no hay materia prima seleccionada
      this.cargarProveedores();
    }
  }

  calcularPrecioTotal() {
    // Asegúrate de que selectedMateriaPrima está definido
    if (this.selectedMateriaPrima) {
      this.precioTotal = this.selectedMateriaPrima.precio * this.nuevaOrdenCompra.cantidad;
    } else {
      this.precioTotal = 0; // Resetear el precio total si no hay materia prima seleccionada
    }
  }

  // Agregar un detalle a la orden
  agregarDetalle() {
    if (this.selectedMateriaPrima && this.nuevaOrdenCompra.cantidad > 0) {
      const detalle = {
        idMateriaPrima: this.selectedMateriaPrima.idMateriaPrima, // Usa el ID de la materia prima seleccionada
        cantidad: this.nuevaOrdenCompra.cantidad,
        precioUnitario: this.selectedMateriaPrima.precio // Asegúrate de que este valor se esté asignando correctamente
      };

      this.detallesOrdenCompra.push(detalle);
      this.calcularPrecioTotal(); // Actualiza el precio total
    } else {
      console.error('Materia prima o cantidad no válidos');
    }
  }



  crearOrdenCompra() {
    // Construye el objeto de orden de compra
    const ordenCompra = {
      idProveedor: this.selectedProveedor?.idProveedor, // Asegúrate de que esto sea correcto
      fechaCompra: new Date(),
      usuario: this.user?.nombreUsuario,
      Detalles: this.detallesOrdenCompra.map(detalle => ({
        idMateriaPrima: detalle.idMateriaPrima, // Asegúrate de que idMateriaPrima esté definido
        cantidad: detalle.cantidad, // Asegúrate de que cantidad esté definida
        precioUnitario: detalle.precioUnitario,
        // Asigna el usuario actual
      }))
    };

    // Verifica que el idProveedor y los detalles no estén vacíos
    if (ordenCompra.idProveedor && ordenCompra.Detalles.length > 0) {
      console.log('Enviando orden de compra:', ordenCompra); // Para depuración

      // Llama al servicio para crear la orden de compra
      this.ordenCompraService.crearOrdenCompra(ordenCompra).subscribe({
        next: (res) => {
          console.log('Orden de compra creada con éxito', res);
          this.obtenerOrdenes(); // Actualiza la lista de órdenes
          this.detallesOrdenCompra = []; // Limpia detalles
          this.precioTotal = 0; // Resetea el precio total
        },
        error: (err) => {
          console.error('Error al crear la orden de compra:', err);
        }
      });
    } else {
      // Proporciona información de depuración adicional
      if (!ordenCompra.idProveedor) {
        console.error('El id del proveedor es requerido.');
      }
      if (ordenCompra.Detalles.length === 0) {
        console.error('Se requieren detalles para la orden de compra.');
      }
    }
  }
  mostrarDetalles(orden: any): void {
    this.ordenSeleccionada = orden; // Almacena la orden seleccionada
  }
}