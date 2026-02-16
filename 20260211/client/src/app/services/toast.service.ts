import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts$ = new Subject<Toast[]>();
  private toastList: Toast[] = [];

  show(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const id = Date.now().toString();
    const toast: Toast = { id, message, type };
    this.toastList = [...this.toastList, toast];
    this.toasts$.next(this.toastList);

    setTimeout(() => this.dismiss(id), 4000);
  }

  dismiss(id: string): void {
    this.toastList = this.toastList.filter(t => t.id !== id);
    this.toasts$.next(this.toastList);
  }
}
