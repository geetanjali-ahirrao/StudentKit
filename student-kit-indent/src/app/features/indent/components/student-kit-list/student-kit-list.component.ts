import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentKit } from '../../../../core/models/indent.models';
import { CartStore } from '../../../../core/services/cart.store';
import { IndentCatalogService } from '../../../../core/services/indent-catalog.service';
import { ToastService } from '../../../../core/services/toast.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { KitRowComponent } from '../kit-row/kit-row.component';

/** Student Kit tab: the kit catalogue plus the quantity form behind it. */
@Component({
  selector: 'app-student-kit-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, KitRowComponent, IconComponent],
  templateUrl: './student-kit-list.component.html',
  styleUrl: './student-kit-list.component.scss',
})
export class StudentKitListComponent {
  private readonly catalog = inject(IndentCatalogService);
  private readonly cart = inject(CartStore);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  /** Lower-cased search term coming from the page header. */
  readonly search = input('');

  protected readonly kits = signal<StudentKit[]>([]);
  protected readonly loading = signal(true);
  protected readonly skeletons = [1, 2, 3, 4];

  protected readonly form = this.fb.group({
    items: this.fb.array<FormGroup>([]),
  });

  protected readonly rows = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.kits()
      .map((kit, index) => ({ kit, index }))
      .filter(
        ({ kit }) =>
          !term ||
          kit.name.toLowerCase().includes(term) ||
          kit.code.toLowerCase().includes(term),
      );
  });

  /** Quantity already in the cart, keyed by kit id. */
  protected readonly cartQuantities = computed(() => {
    const quantities = new Map<string, number>();
    for (const line of this.cart.kitLines()) {
      quantities.set(line.refId, (quantities.get(line.refId) ?? 0) + line.quantity);
    }
    return quantities;
  });

  constructor() {
    this.catalog
      .getStudentKits()
      .pipe(takeUntilDestroyed())
      .subscribe((kits) => {
        this.kits.set(kits);
        this.buildForm(kits);
        this.loading.set(false);
      });
  }

  protected get items(): FormArray<FormGroup> {
    return this.form.get('items') as FormArray<FormGroup>;
  }

  protected groupAt(index: number): FormGroup {
    return this.items.at(index);
  }

  protected addToCart(index: number): void {
    const group = this.groupAt(index);
    const kit = this.kits()[index];

    if (group.invalid) {
      group.markAllAsTouched();
      this.toast.show('Fix the quantity before adding this kit.', 'error');
      return;
    }

    const quantity = Number(group.get('quantity')?.value ?? 0);
    if (quantity <= 0) {
      return;
    }

    this.cart.addKit(kit, quantity);
    group.get('quantity')?.setValue(0);
    group.markAsUntouched();
    group.markAsPristine();
    this.toast.show(`${kit.code} - ${kit.name} added to cart (${quantity}).`);
  }

  private buildForm(kits: StudentKit[]): void {
    this.items.clear();
    for (const kit of kits) {
      this.items.push(
        this.fb.group({
          kitId: [kit.id],
          quantity: [
            0,
            [Validators.required, Validators.min(0), Validators.max(kit.maxQuantity)],
          ],
        }),
      );
    }
  }
}
