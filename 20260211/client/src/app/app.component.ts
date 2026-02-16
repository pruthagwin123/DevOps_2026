import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ToastStackComponent } from './components/shared/toast-stack.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginComponent, DashboardComponent, ToastStackComponent],
  template: `
    <div class="app">
      <app-toast-stack></app-toast-stack>
      @if (authService.isAuthenticated$ | async) {
        <app-dashboard></app-dashboard>
      } @else {
        <app-login></app-login>
      }
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.checkSession();
  }
}
