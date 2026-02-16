import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, LoginPayload } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-screen">
      <div class="login-card">
        <h1>Welcome back</h1>
        <p class="muted">Enter a username and 4-digit PIN to continue.</p>
        <p class="muted">New username creates a fresh profile.</p>
        <form (ngSubmit)="onSubmit()" class="login-form">
          <label>
            Username
            <input
              type="text"
              [(ngModel)]="username"
              name="username"
              placeholder="Your name"
              required
            />
          </label>
          <label>
            4-digit PIN
            <input
              type="password"
              inputmode="numeric"
              maxlength="4"
              [(ngModel)]="pin"
              name="pin"
              placeholder="0000"
              required
            />
          </label>
          @if (error) {
            <div class="error">{{ error }}</div>
          }
          <button type="submit">Unlock</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-screen {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
    }

    .login-card {
      background: var(--card);
      padding: 32px;
      border-radius: 24px;
      box-shadow: var(--shadow);
      width: min(420px, 92vw);
      display: grid;
      gap: 16px;
    }

    .login-form {
      display: grid;
      gap: 12px;
    }

    .login-form label {
      display: grid;
      gap: 6px;
      color: var(--muted);
      font-size: 0.9rem;
    }

    .error {
      background: #ffe4d6;
      color: #9b3b15;
      padding: 12px 16px;
      border-radius: 12px;
    }
  `]
})
export class LoginComponent {
  username = '';
  pin = '';
  error = '';

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.error = '';
    const payload: LoginPayload = { username: this.username, pin: this.pin };
    
    this.authService.login(payload.username, payload.pin).subscribe({
      next: () => {
        this.username = '';
        this.pin = '';
      },
      error: (err) => {
        this.error = err.error?.error || 'Login failed.';
      }
    });
  }
}
