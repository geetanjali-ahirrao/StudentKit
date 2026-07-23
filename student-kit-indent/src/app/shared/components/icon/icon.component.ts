import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type IconName =
  | 'menu'
  | 'support'
  | 'bell'
  | 'cart'
  | 'chevron-down'
  | 'chevron-right'
  | 'arrow-left'
  | 'arrow-right'
  | 'search'
  | 'plus'
  | 'minus'
  | 'home'
  | 'user'
  | 'users'
  | 'file-text'
  | 'rupee'
  | 'calendar'
  | 'chart'
  | 'download'
  | 'trash'
  | 'check'
  | 'check-circle'
  | 'info'
  | 'alert'
  | 'close'
  | 'shirt'
  | 'box';

/** Stroke paths for every icon in the app, so no icon font is needed. */
const ICON_PATHS: Record<IconName, string[]> = {
  menu: ['M4 7h12', 'M4 12h16', 'M4 17h12'],
  support: [
    'M4 13v-1a8 8 0 0 1 16 0v1',
    'M4 13h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z',
    'M20 13h-2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1z',
  ],
  bell: ['M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9', 'M13.7 21a2 2 0 0 1-3.4 0'],
  cart: [
    'M9 21.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5z',
    'M19 21.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5z',
    'M2 3h3l2.6 12.1a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L21 7H6',
  ],
  'chevron-down': ['M6 9.5l6 6 6-6'],
  'chevron-right': ['M9 5.5l6 6.5-6 6.5'],
  'arrow-left': ['M20 12H4', 'M11 19l-7-7 7-7'],
  'arrow-right': ['M4 12h16', 'M13 5l7 7-7 7'],
  search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'M21 21l-4.3-4.3'],
  plus: ['M12 5v14', 'M5 12h14'],
  minus: ['M5 12h14'],
  home: ['M3 10.6L12 3l9 7.6', 'M5.5 9.4V21h13V9.4', 'M10 21v-6h4v6'],
  user: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  users: [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    'M22 21v-2a4 4 0 0 0-3-3.9',
    'M16 3.1a4 4 0 0 1 0 7.8',
  ],
  'file-text': ['M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z', 'M14 3v5h5', 'M9 13h6', 'M9 17h4'],
  rupee: ['M7 4h10', 'M7 8.5h10', 'M15.5 4c0 3.6-2.6 4.5-6 4.5H7l8 11.5'],
  calendar: ['M8 3v3.5', 'M16 3v3.5', 'M4 9.5h16', 'M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z'],
  chart: ['M4 20V11', 'M10 20V4', 'M16 20v-6', 'M22 20h-20'],
  download: ['M12 3v11', 'M8 10.5l4 4 4-4', 'M4 20h16'],
  trash: ['M4 7h16', 'M9.5 7V4.8h5V7', 'M6.5 7l1 13.2h9L17.5 7', 'M10 11v6', 'M14 11v6'],
  check: ['M20 6.5L9.5 17 4 11.5'],
  'check-circle': ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M8 12.2l2.8 2.8L16 9.8'],
  info: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 11v6', 'M12 7.6v.4'],
  alert: ['M12 9v5', 'M12 17.4v.2', 'M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z'],
  close: ['M18 6L6 18', 'M6 6l12 12'],
  shirt: ['M8.5 3l3.5 2.6L15.5 3l5 2.8-2 4.4-2.2-1V21H7.7V9.2l-2.2 1-2-4.4z'],
  box: ['M21 8.2l-9-5-9 5 9 5 9-5z', 'M3 8.2V16l9 5 9-5V8.2', 'M12 13.2V21'],
};

/** Inline SVG icon. Colour follows `currentColor`, size is set by the caller. */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-icon' },
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: none;
        line-height: 0;
      }
    `,
  ],
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      @for (path of paths(); track path) {
        <path [attr.d]="path"></path>
      }
    </svg>
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input(20);
  readonly strokeWidth = input(1.7);

  protected readonly paths = computed(() => ICON_PATHS[this.name()] ?? []);
}
