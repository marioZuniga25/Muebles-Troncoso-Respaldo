import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Input() message: string = '';  // Mensaje de la alerta
  @Input() type: 'success' | 'info' | 'warning' | 'danger' = 'info';  // Tipo de alerta
  @Input() isVisible: boolean = false;  // Controlar la visibilidad de la alerta

  @Output() closed = new EventEmitter<void>();  // Emitir evento al cerrar la alerta

  closeAlert() {
    this.isVisible = false;
    this.closed.emit();
  }
}
