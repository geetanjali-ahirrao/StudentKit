import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { IconComponent } from '../icon/icon.component';

/**
 * Stand-in for the modules that are out of scope for this task, so every
 * sidebar link leads somewhere instead of dead-ending.
 */
@Component({
  selector: 'app-page-placeholder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RouterLink],
  templateUrl: './page-placeholder.component.html',
  styleUrl: './page-placeholder.component.scss',
})
export class PagePlaceholderComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly title = toSignal(
    this.route.data.pipe(map((data) => (data['title'] as string) ?? 'Module')),
    { initialValue: 'Module' },
  );
}
