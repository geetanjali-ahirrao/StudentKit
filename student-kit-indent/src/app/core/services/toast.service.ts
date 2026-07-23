import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'info' | 'error';

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

/** Lightweight, dependency-free feedback strip used after cart actions. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  private readonly toastState = signal<Toast[]>([]);

  readonly toasts = this.toastState.asReadonly();

  show(message: string, kind: ToastKind = 'success', durationMs = 3200): void {
    const id = ++this.nextId;
    this.toastState.update((toasts) => [...toasts, { id, kind, message }]);
    setTimeout(() => this.dismiss(id), durationMs);
  }

  dismiss(id: number): void {
    this.toastState.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }
}
