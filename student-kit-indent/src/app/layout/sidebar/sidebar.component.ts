import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { LayoutStore } from '../../core/services/layout.store';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { NAV_GROUPS, NavGroup } from './nav-items';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly router = inject(Router);
  private readonly layout = inject(LayoutStore);

  protected readonly groups = NAV_GROUPS;
  protected readonly isCollapsed = this.layout.isCollapsed;

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  /** Groups the user opened or closed by hand, overriding the route default. */
  private readonly manualState = signal<Record<string, boolean>>({});

  private readonly activeGroupId = computed(() => {
    const url = this.currentUrl();
    return this.groups.find((group) => group.children.some((child) => url.startsWith(child.route)))
      ?.id;
  });

  protected isActive(group: NavGroup): boolean {
    return this.activeGroupId() === group.id;
  }

  protected isExpanded(group: NavGroup): boolean {
    if (this.isCollapsed()) {
      return false;
    }
    return this.manualState()[group.id] ?? this.isActive(group);
  }

  protected toggle(group: NavGroup): void {
    const expanded = this.isExpanded(group);
    this.manualState.update((state) => ({ ...state, [group.id]: !expanded }));
  }

  protected onNavigate(): void {
    this.layout.closeDrawer();
  }
}
