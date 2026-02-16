import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast-stack',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-stack">
      @for (toast of toasts; track toast.id) {
        <div [ngClass]="['toast', toast.type]" role="alert">
          <p>{{ toast.message }}</p>
          <button (click)="toastService.dismiss(toast.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-stack {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: grid;
      gap: 10px;
      z-index: 9999;
      max-width: 360px;
    }

    .toast {
      padding: 12px 16px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 200ms ease;
    }

    .toast p {
      margin: 0;
      font-size: 0.9rem;
    }

    .toast button {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0;
    }

    .toast.success {
      background: #e3f7ed;
      color: #0d5e48;
    }

    .toast.error {
      background: #fde7e4;
      color: #9b3b15;
    }

    .toast.info {
      background: #e8f4f8;
      color: #104050;
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class ToastStackComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(public toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }
}
