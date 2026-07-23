import { ChangeDetectionStrategy, Component, HostListener, ElementRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../core/services/cart.store';
import { IndentCatalogService } from '../../core/services/indent-catalog.service';
import { LayoutStore } from '../../core/services/layout.store';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-topbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RouterLink],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  private readonly layout = inject(LayoutStore);
  private readonly catalog = inject(IndentCatalogService);
  private readonly cart = inject(CartStore);
  private readonly toast = inject(ToastService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly centre = this.catalog.centre;
  protected readonly cartCount = this.cart.itemCount;
  protected readonly menuOpen = signal(false);

  protected toggleNav(): void {
    this.layout.toggleNav();
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected notify(message: string): void {
    this.menuOpen.set(false);
    this.toast.show(message, 'info');
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.menuOpen() && !this.host.nativeElement.contains(event.target as Node)) {
      this.menuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.menuOpen.set(false);
  }
}
