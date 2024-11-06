import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/AuthResponse';
import { AuthService } from '../../services/auth.service';
import { DashboardComponent } from "../dashboard/dashboard.component";

@Component({
  selector: 'app-inicio-admin',
  standalone: true,
  templateUrl: './inicio-admin.component.html',
  styleUrls: ['./inicio-admin.component.css'],
  imports: [DashboardComponent]
})
export class InicioAdminComponent implements OnInit {
  user: User | null = null;
  saludo: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.saludo = this.getSaludo();
  }

  getSaludo(): string {
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 6) {
      return 'Buenas noches';
    } else if (currentHour >= 6 && currentHour < 12) {
      return 'Buenos días';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Buenas tardes';
    } else {
      return 'Buenas noches';
    }
  }
}
