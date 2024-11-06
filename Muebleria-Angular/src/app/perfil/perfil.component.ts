import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../services/perfil.service';
import { IUsuarioDetalle } from '../interfaces/IUsuarioDetalle';
import { ActivatedRoute } from '@angular/router';
import { IUtarjetas } from '../interfaces/ITarjetas';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { IDireccionEnvio } from '../interfaces/IDireccionEnvio';
import { IPersona } from '../interfaces/IPersona';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs, 'es');
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  user: IUsuarioDetalle | null = null;
  personaId: number = parseInt(localStorage.getItem('userId') || '0') || 0;
  idUsuario: number = this.route.snapshot.params['id'];
  tarjetas: IUtarjetas[] = [];
  isModalOpen = false;
  isModalOpenUser = false;
  isEditing: boolean = false; contraseniaActual: string = ''; // Variable para la contraseña actual
  nuevaContrasenia: string = ''; // Variable para la nueva contraseña
  mostrarErrorContrasenia: boolean = false; // Para indicar si hay un error
  mensajeErrorContrasenia: string = ''; // Mensaje de error detallado
  confirmarContrasenia: string = ''; // Nueva variable para confirmar la contraseña
  mostrarErrorConfirmarContrasenia: boolean = false; // Bandera de error
  mensajeErrorConfirmarContrasenia: string = ''; // Mensaje de error
  ultimoInicioSesion: Date | null = null;

  // DEFINICIÓN DE OBJETOS

  nuevaTarjeta: IUtarjetas = {
    idTarjeta: 0,
    idUsuario: this.route.snapshot.params['id'],
    nombrePropietario: '',
    numeroTarjeta: '',
    fechaVencimiento: '',
    ccv: ''
  };

  userEdit: IUsuarioDetalle = {
    idUsuario: 0,
    nombreUsuario: '',
    correo: '',
    contrasenia: '',
    rol: 0,
    confirmPassword: '',
    type: 0
  }

  personaEdit: IPersona = {
    id: 0,
    nombre: '',
    apellidos: '',
    telefono: '',
    correo: '',
    usuarioId: this.route.snapshot.params['id'],
    direccionesEnvio: []
  };

  estados: string[] = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
    'Chiapas', 'Chihuahua', 'Coahuila', 'Colima', 'Durango', 'Guanajuato',
    'Guerrero', 'Hidalgo', 'Jalisco', 'Mexico', 'Michoacán', 'Morelos',
    'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro',
    'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora',
    'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz',
    'Yucatán', 'Zacatecas'
  ];


  errorMessages = { // Cambiar a un objeto para mensajes específicos
    nombreDireccion: '',
    calle: '',
    numero: '',
    colonia: '',
    ciudad: '',
    estado: '',
    codigoPostal: '',
  };

  isFormValid = true;

  direcciones: IDireccionEnvio[] = []; // Añadir variable para las direcciones
  nuevaDireccion: IDireccionEnvio = {
    id: 0,
    nombreDireccion: '',
    esPredeterminada: false,
    calle: '',
    numero: '',
    colonia: '',
    ciudad: '',
    estado: '',
    codigoPostal: '',
    personaId: 0,
  };

  constructor(private route: ActivatedRoute, private AuthService: AuthService, private perfilService: PerfilService, private router: Router) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.params['id'];
    this.cargarDatosUsuario(userId);
    this.cargarTarjetasUsuario(userId);
    this.getDireccionesPorPersona(userId);
    this.obtenerUltimoInicioSesion(userId);

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Precargar el correo y el nombre de usuario
      this.personaEdit.correo = parsedUser.correo;
      this.personaEdit.nombre = parsedUser.persona.nombre;
      this.personaEdit.apellidos = parsedUser.persona.apellidos;
      this.personaEdit.telefono = parsedUser.persona.telefono;
      this.userEdit.nombreUsuario = parsedUser.nombreUsuario;
      console.log(parsedUser);
    }
  }

  cargarDatosUsuario(userId: number): void {
    this.perfilService.getUserDetails(userId).subscribe(
      (data: IUsuarioDetalle) => {
        this.user = data;
        // Si tienes más direcciones y deseas gestionar alguna, puedes agregar lógica aquí
      },
      (error) => {
        console.error('Error fetching user details', error);
      }
    );
  }

  cargarTarjetasUsuario(userId: number): void {
    this.perfilService.getUserCards(userId).subscribe(
      (data: IUtarjetas[]) => {
        this.tarjetas = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching user cards', error);
      }
    );
  }

  // Método para obtener las direcciones de una persona por ID
  getDireccionesPorPersona(userId: number): void {
    this.perfilService.getDireccionesPorPersona(userId).subscribe(
      (data: IDireccionEnvio[]) => {
        this.direcciones = data;
      },
      (error) => {
        console.error('Error fetching user addresses', error);
      }
    );
  }

  // Método para validar la dirección
  validarDireccion(direccion: IDireccionEnvio): boolean {
    this.errorMessages = { // Cambiar a un objeto para mensajes específicos
      nombreDireccion: '',
      calle: '',
      numero: '',
      colonia: '',
      ciudad: '',
      estado: '',
      codigoPostal: '',
    };

    let isValid = true;

    if (!direccion.nombreDireccion) {
      this.errorMessages.nombreDireccion = 'El nombre de la dirección es requerido.';
      isValid = false;
    }
    if (!direccion.calle) {
      this.errorMessages.calle = 'La calle es requerida.';
      isValid = false;
    }
    if (!direccion.numero) {
      this.errorMessages.numero = 'El número es requerido.';
      isValid = false;
    }
    if (!direccion.colonia) {
      this.errorMessages.colonia = 'La colonia es requerida.';
      isValid = false;
    }
    if (!direccion.ciudad) {
      this.errorMessages.ciudad = 'La ciudad es requerida.';
      isValid = false;
    }
    if (!direccion.estado) {
      this.errorMessages.estado = 'El estado es requerido.';
      isValid = false;
    }
    if (!direccion.codigoPostal) {
      this.errorMessages.codigoPostal = 'El código postal es requerido.';
      isValid = false;
    } else if (!/^\d{5}$/.test(direccion.codigoPostal)) {
      this.errorMessages.codigoPostal = 'El código postal debe tener 5 dígitos.';
      isValid = false;
    }

    return isValid;
  }

  // Guardar o modificar la dirección según el estado
  guardarDireccion(): void {
    if (this.isEditing) {
      this.modificarDireccion();
    } else {
      this.agregarDireccion();
    }
  }

  agregarDireccion(): void {
    this.nuevaDireccion.personaId = this.personaId ?? 0; // Asigna el ID del usuario

    if (this.direcciones.length === 0) {
      // Si es la primera dirección, la establecemos como predeterminada
      this.nuevaDireccion.esPredeterminada = true;
      this.enviarDireccion();
    } else {
      // Preguntar al usuario si desea agregarla como predeterminada
      Swal.fire({
        title: '¿Deseas establecer esta dirección como predeterminada?',
        text: `${this.nuevaDireccion.nombreDireccion}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          this.setAllDirectionsToFalse(() => {
            this.nuevaDireccion.esPredeterminada = true;
            this.enviarDireccion();
          });
        } else {
          this.nuevaDireccion.esPredeterminada = false;
          this.enviarDireccion();
        }
      });
    }
  }

  // Lógica para modificar dirección
  modificarDireccion(): void {
    Swal.fire({
      title: '¿Deseas establecer esta dirección como predeterminada?',
      text: `${this.nuevaDireccion.nombreDireccion}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.setAllDirectionsToFalse(() => {
          this.nuevaDireccion.esPredeterminada = true;
          this.enviarModificacion();
        });
      } else {
        this.nuevaDireccion.esPredeterminada = false;
        this.enviarModificacion();
      }
    });
  }

  enviarModificacion(): void {
    this.perfilService.updateAddress(this.nuevaDireccion.id, this.nuevaDireccion).subscribe(
      () => {
        const index = this.direcciones.findIndex(d => d.id === this.nuevaDireccion.id);
        if (index !== -1) {
          this.direcciones[index] = { ...this.nuevaDireccion };
        }
        Swal.fire('Éxito', 'Dirección modificada exitosamente.', 'success');
        this.resetDireccion();  // Limpiar formulario después de modificar
        this.isEditing = false;
      },
      (error) => {
        Swal.fire('Error', 'Hubo un problema al modificar la dirección.', 'error');
        console.error('Error al modificar dirección:', error);
      }
    );
  }


  enviarDireccion(): void {
    this.perfilService.addAddress(this.nuevaDireccion.personaId || 0, this.nuevaDireccion).subscribe(
      (direccion: IDireccionEnvio) => {
        this.direcciones.push(direccion);
        this.resetDireccion();
      },
      (error) => {
        console.error('Error adding address', error);
      }
    );
  }

  // Método para establecer todas las direcciones como no predeterminadas
  setAllDirectionsToFalse(callback: () => void): void {
    const updates = this.direcciones.map(direccion => {
      direccion.esPredeterminada = false;
      return this.perfilService.updateAddress(direccion.id, direccion).toPromise();
    });

    Promise.all(updates)
      .then(() => callback())
      .catch(error => console.error('Error updating addresses', error));
  }


  resetDireccion(): void {
    this.nuevaDireccion = {
      id: 0,
      nombreDireccion: '',
      esPredeterminada: true,
      calle: '',
      numero: '',
      colonia: '',
      ciudad: '',
      estado: '',
      codigoPostal: '',
      personaId: 0,
    };
  }

  abrirModalEditarDireccion(direccion: IDireccionEnvio): void {
    this.nuevaDireccion = { ...direccion }; // Populate the form with current address data
    this.isEditing = true;
  }



  agregarTarjeta(): void {
    this.perfilService.addCard(this.nuevaTarjeta).subscribe(
      (tarjeta: IUtarjetas) => {
        this.tarjetas.push(tarjeta);
        Swal.fire('Éxito', 'Tarjeta agregada exitosamente.', 'success');
        this.resetTarjeta();
      },
      (error) => {
        Swal.fire('Error', 'Hubo un problema al agregar la tarjeta.', 'error');
        console.error('Error adding card', error);
      }
    );
  }

  resetTarjeta(): void {
    this.nuevaTarjeta = {
      idTarjeta: 0,
      idUsuario: this.route.snapshot.params['id'] || 0,
      nombrePropietario: '',
      numeroTarjeta: '',
      fechaVencimiento: '',
      ccv: ''
    };
  }

  eliminarTarjeta(cardId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.perfilService.deleteCard(cardId).subscribe(
          () => {
            this.tarjetas = this.tarjetas.filter(t => t.idTarjeta !== cardId);
            Swal.fire('Eliminada', 'La tarjeta ha sido eliminada.', 'success');
          },
          (error) => {
            Swal.fire('Error', 'Hubo un problema al eliminar la tarjeta.', 'error');
            console.error('Error deleting card', error);
          }
        );
      }
    });
  }

  abrirModalUsuario(idUsuario: number | undefined): void {
    if (idUsuario) {
      this.perfilService.getUserDetails(idUsuario).subscribe(
        (data: IUsuarioDetalle) => {
          this.userEdit = data || this.userEdit; // Precargar datos si existen
          this.isModalOpenUser = true; // Mostrar modal
        },
        (error) => {
          console.error('Error al cargar detalles del usuario:', error);
          this.isModalOpenUser = true; // Mostrar modal aunque haya error para agregar un usuario nuevo
        }
      );
    } else {
      this.isModalOpenUser = true; // Mostrar modal para nuevo usuario
    }
  }

  cerrarModalUsuario(): void {
    this.isModalOpenUser = false;
    this.userEdit = {
      idUsuario: 0,
      nombreUsuario: '',
      correo: '',
      contrasenia: '',
      rol: 0,
      confirmPassword: '',
      type: 0
    };
    this.contraseniaActual = ''; // Limpiar campo de contraseña actual
    this.nuevaContrasenia = ''; // Limpiar campo de nueva contraseña
  }

  abrirModalModificarPersona(idUsuario: number | undefined): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // Precargar datos de usuario y perfil
      this.userEdit = {
        idUsuario: parsedUser.idUsuario || 0,
        nombreUsuario: parsedUser.nombreUsuario || '',
        correo: parsedUser.correo || '',
        contrasenia: '', // Este campo no se debe mostrar ni precargar por seguridad
        rol: parsedUser.rol || 0,
        confirmPassword: '', // Este campo no se debe mostrar ni precargar por seguridad
        type: parsedUser.type || 0
      };

      this.personaEdit = {
        id: parsedUser.persona?.id || 0,
        nombre: parsedUser.persona?.nombre || '',
        apellidos: parsedUser.persona?.apellidos || '',
        telefono: parsedUser.persona?.telefono || '',
        correo: parsedUser.correo || '',
        usuarioId: parsedUser.idUsuario || 0,
        direccionesEnvio: parsedUser.persona?.direccionesEnvio || []
      };

      console.log('Datos precargados:', parsedUser);
      this.isModalOpen = true; // Abre el modal
    } else {
      console.error('No se encontró ningún usuario almacenado en localStorage');
    }
  }

  cerrarModal(): void {
    this.isModalOpen = false;
    this.userEdit = {
      idUsuario: 0,
      nombreUsuario: '',
      correo: '',
      contrasenia: '',
      rol: 0,
      confirmPassword: '',
      type: 0
    }
  }

  // Método para eliminar una dirección
  // Método para eliminar una dirección
  eliminarDireccion(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.perfilService.deleteAddress(id).subscribe(() => {
          // Filtra el array para eliminar la dirección que coincide con el ID
          this.direcciones = this.direcciones.filter(d => d.id !== id);
          Swal.fire('Eliminada', 'La dirección ha sido eliminada.', 'success');
        }, (error) => {
          Swal.fire('Error', 'Hubo un problema al eliminar la dirección.', 'error');
          console.error('Error deleting address', error);
        });
      }
    });
  }

  onSubmit(): void {
    this.mostrarErrorContrasenia = false;
    this.mostrarErrorConfirmarContrasenia = false;

    // Validar que la confirmación de la contraseña coincida con la nueva contraseña
    if (this.nuevaContrasenia.trim() !== this.confirmarContrasenia.trim()) {
      this.mostrarErrorConfirmarContrasenia = true;
      this.mensajeErrorConfirmarContrasenia = 'La confirmación de la contraseña no coincide.';
      return;
    }

    // Validar que la contraseña cumpla con los estándares de seguridad
    if (!this.validatePassword(this.nuevaContrasenia)) {
      this.mostrarErrorContrasenia = true;
      this.mensajeErrorContrasenia = 'La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial.';
      return;
    }

    // Continuar con la lógica si todo es válido
    if (!this.idUsuario) {
      console.error("El ID del usuario no puede estar vacío.");
      return;
    }

    const usuarioDetalle: IUsuarioDetalle = {
      idUsuario: this.idUsuario,
      nombreUsuario: this.userEdit.nombreUsuario,
      correo: this.userEdit.correo,
      contrasenia: this.nuevaContrasenia,
      rol: this.userEdit.rol,
      confirmPassword: this.nuevaContrasenia,
      type: this.userEdit.type
    };

    this.perfilService.updateUser(usuarioDetalle.idUsuario ?? 0, { ...usuarioDetalle, contrasenia: this.nuevaContrasenia })
      .subscribe(
        respuesta => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Usuario actualizado correctamente',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            // Redirigir al perfil
            this.router.navigate(['/login']);
            localStorage.removeItem('userId');
          });

          localStorage.setItem('currentUser', JSON.stringify(respuesta));


          this.cerrarModalUsuario();
          this.ngOnInit();
          this.AuthService.removeUser();
          this.user = null;
          this.router.navigate(['/login']);
          localStorage.removeItem('userId');
        },
        error => {
          console.error("Error al actualizar el usuario:", error);
          this.mostrarErrorContrasenia = true;
          this.mensajeErrorContrasenia = 'Hubo un problema al actualizar el usuario. Inténtalo de nuevo.';
        }
      );
  }

  validatePassword(contrasenia: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(contrasenia);
  }

  onSubmitPerfil(): void {
    // Validación simple antes de enviar los datos de perfil
    if (!this.personaEdit || this.personaEdit.usuarioId <= 0) {
      Swal.fire('Error', 'Los datos del perfil están incompletos.', 'error');
      return;
    }

    if (this.personaEdit.id > 0) {
      // Perfil existente, usar el endpoint de actualización
      this.perfilService.updateProfile(this.personaEdit.id, this.personaEdit).subscribe(
        () => {
          localStorage.setItem('currentUser', JSON.stringify(this.personaEdit));
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Perfil actualizado exitosamente',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            // Redirigir o actualizar la página de perfil
            this.router.navigate(['/login']);
            localStorage.removeItem('userId');
          });
          this.cerrarModal(); // Cerrar el modal después de guardar
          this.ngOnInit(); // Recargar los datos si es necesario
        },
        (error) => {
          console.error("Error al actualizar el perfil:", error);
          const mensajeError = error.error?.message || 'Hubo un problema al actualizar el perfil. Inténtalo de nuevo.';
          Swal.fire('Error', mensajeError, 'error');
        }
      );
    } else {
      // Nuevo perfil, usar el endpoint de agregar
      this.perfilService.addProfile(this.personaEdit).subscribe(
        (respuesta: IPersona) => {
          localStorage.setItem('currentUser', JSON.stringify(respuesta));
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Perfil agregado exitosamente',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            // Redirigir al perfil
            this.router.navigate(['/login']);
            localStorage.removeItem('userId');
          });
          this.cerrarModal(); // Cerrar el modal después de guardar
          this.ngOnInit(); // Recargar los datos si es necesario
        },
        (error) => {
          console.error("Error al agregar el perfil:", error);
          const mensajeError = error.error?.message || 'Hubo un problema al agregar el perfil. Inténtalo de nuevo.';
          Swal.fire('Error', mensajeError, 'error');
        }
      );
    }
  }

  // Método para obtener el último inicio de sesión
  obtenerUltimoInicioSesion(userId: number): void {
    this.AuthService.getUltimoInicioSesion(userId).subscribe(
      (data: { fechaInicioSesion: Date }) => {
        this.ultimoInicioSesion = data.fechaInicioSesion;
      },
      (error) => {
        console.error('Error al obtener el último inicio de sesión', error);
      }
    );
  }
}
