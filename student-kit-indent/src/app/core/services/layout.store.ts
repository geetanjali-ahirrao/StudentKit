import { Injectable, computed, signal } from '@angular/core';

export const MOBILE_BREAKPOINT = 992;

/** Shell chrome state shared by the topbar and the sidebar. */
@Injectable({ providedIn: 'root' })
export class LayoutStore {
  private readonly viewportWidth = signal(
    typeof window === 'undefined' ? 1440 : window.innerWidth,
  );
  private readonly drawerOpen = signal(false);
  private readonly railCollapsed = signal(false);

  readonly isMobile = computed(() => this.viewportWidth() < MOBILE_BREAKPOINT);
  readonly isDrawerOpen = computed(() => this.isMobile() && this.drawerOpen());
  readonly isCollapsed = computed(() => !this.isMobile() && this.railCollapsed());

  setViewportWidth(width: number): void {
    this.viewportWidth.set(width);
    if (width >= MOBILE_BREAKPOINT) {
      this.drawerOpen.set(false);
    }
  }

  toggleNav(): void {
    if (this.isMobile()) {
      this.drawerOpen.update((open) => !open);
    } else {
      this.railCollapsed.update((collapsed) => !collapsed);
    }
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }
}
