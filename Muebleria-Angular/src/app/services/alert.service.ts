import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface Alert {
  type: 'success' | 'info' | 'warning' | 'danger';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new Subject<Alert | null>();
  private keepAfterNavigationChange = false;

  constructor() {}

  getAlert(): Observable<Alert | null> {
    return this.alertSubject.asObservable();
  }

  success(message: string, keepAfterNavigationChange = false): void {
    this.alert({ type: 'success', message }, keepAfterNavigationChange);
  }

  info(message: string, keepAfterNavigationChange = false): void {
    this.alert({ type: 'info', message }, keepAfterNavigationChange);
  }

  warning(message: string, keepAfterNavigationChange = false): void {
    this.alert({ type: 'warning', message }, keepAfterNavigationChange);
  }

  danger(message: string, keepAfterNavigationChange = false): void {
    this.alert({ type: 'danger', message }, keepAfterNavigationChange);
  }

  clear(): void {
    // clear alerts by emitting null
    this.alertSubject.next(null);
  }

  private alert(alert: Alert, keepAfterNavigationChange: boolean): void {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.alertSubject.next(alert);
  }
}
