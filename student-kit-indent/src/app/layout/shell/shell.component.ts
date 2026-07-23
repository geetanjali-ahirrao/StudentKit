import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutStore } from '../../core/services/layout.store';
import { ToastService } from '../../core/services/toast.service';
import { ToastHostComponent } from '../../shared/components/toast-host/toast-host.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

/** Application chrome: topbar, sidebar and the routed page. */
@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, ToastHostComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private readonly layout = inject(LayoutStore);
  private readonly toast = inject(ToastService);

  protected readonly isDrawerOpen = this.layout.isDrawerOpen;
  protected readonly year = new Date().getFullYear();
  protected readonly footerLinks = ['Terms & Conditions', 'Privacy Policy', 'Refund Policy', 'Help'];

  @HostListener('window:resize')
  protected onResize(): void {
    this.layout.setViewportWidth(window.innerWidth);
  }

  protected closeDrawer(): void {
    this.layout.closeDrawer();
  }

  protected onFooterLink(label: string): void {
    this.toast.show(`${label} is not part of this task.`, 'info');
  }
}
