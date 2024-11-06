import { Component } from '@angular/core';
import { ContactoService } from '../services/contacto.service';
import { IContacto } from '../interfaces/IContactoResponse';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule,CommonModule],
    templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
})
export class ContactoComponent {

  contacto: IContacto = {
    nombre: '',
    correo: '',
    telefono: '',
    mensaje: ''
  };

  constructor(private contactoService: ContactoService) {}

  enviarContacto(form: NgForm): void {
    if (form.invalid || !this.validatePhoneNumber() || !this.validateEmail()) {
      this.showValidationErrors(form);
      return;
    }

    this.contactoService.agregarContacto(this.contacto).subscribe(
      response => {
        this.resetForm(form);
        Swal.fire('Éxito', 'Tu mensaje ha sido enviado correctamente.', 'success');
      },
      error => {
        Swal.fire('Error', 'Hubo un problema al enviar tu mensaje. Inténtalo nuevamente.', 'error');
      }
    );
  }

  private showValidationErrors(form: NgForm): void {
    if (form.controls['nombre'].invalid) {
      Swal.fire('Error', 'El nombre es necesario.', 'error');
    } else if (form.controls['correo'].invalid || !this.validateEmail()) {
      Swal.fire('Error', 'Por favor, ingresa un correo electrónico válido.', 'error');
    } else if (form.controls['telefono'].invalid || !this.validatePhoneNumber()) {
      Swal.fire('Error', 'Por favor, ingresa un teléfono válido (XXX-XXX-XXXX).', 'error');
    } else if (form.controls['mensaje'].invalid) {
      Swal.fire('Error', 'El mensaje es necesario.', 'error');
    }
  }

  private validatePhoneNumber(): boolean {
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
    return phonePattern.test(this.contacto.telefono);
  }

  private validateEmail(): boolean {
    return this.contacto.correo.includes('@');
  }

  private resetForm(form: NgForm): void {
    form.resetForm();
    this.contacto = {
      nombre: '',
      correo: '',
      telefono: '',
      mensaje: ''
    };
  }

  onPhoneNumberInput(event: Event): void {
    let input = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    if (input.length > 3 && input.length <= 6) {
      input = `${input.slice(0, 3)}-${input.slice(3)}`;
    } else if (input.length > 6) {
      input = `${input.slice(0, 3)}-${input.slice(3, 6)}-${input.slice(6, 10)}`;
    }
    this.contacto.telefono = input;
  }
}
