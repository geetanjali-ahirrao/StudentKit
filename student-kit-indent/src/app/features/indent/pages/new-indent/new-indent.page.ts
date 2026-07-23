import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, startWith } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { CartSummaryComponent } from '../../components/cart-summary/cart-summary.component';
import { ExtraUniformListComponent } from '../../components/extra-uniform-list/extra-uniform-list.component';
import { StudentKitListComponent } from '../../components/student-kit-list/student-kit-list.component';

type IndentTab = 'kit' | 'uniform';

/** New Indent screen: kit and uniform tabs over a shared cart. */
@Component({
  selector: 'app-new-indent-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    IconComponent,
    StudentKitListComponent,
    ExtraUniformListComponent,
    CartSummaryComponent,
  ],
  templateUrl: './new-indent.page.html',
  styleUrl: './new-indent.page.scss',
})
export class NewIndentPage {
  private readonly location = inject(Location);
  private readonly toast = inject(ToastService);

  protected readonly tab = signal<IndentTab>('kit');
  protected readonly searchControl = new FormControl('', { nonNullable: true });

  protected readonly search = toSignal(
    this.searchControl.valueChanges.pipe(debounceTime(200), startWith('')),
    { initialValue: '' },
  );

  protected selectTab(tab: IndentTab): void {
    this.tab.set(tab);
  }

  protected clearSearch(): void {
    this.searchControl.setValue('');
  }

  protected goBack(): void {
    this.location.back();
  }

  protected onQuickAdd(): void {
    this.toast.show('Adding items outside the catalogue is not part of this task.', 'info');
  }
}
