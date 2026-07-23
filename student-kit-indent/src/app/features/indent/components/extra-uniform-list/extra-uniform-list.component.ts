import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExtraUniform } from '../../../../core/models/indent.models';
import { CartStore } from '../../../../core/services/cart.store';
import { IndentCatalogService } from '../../../../core/services/indent-catalog.service';
import { ToastService } from '../../../../core/services/toast.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { UniformRowComponent } from '../uniform-row/uniform-row.component';

/** Extra Uniform tab: uniforms ordered on top of the kit allocation. */
@Component({
  selector: 'app-extra-uniform-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, UniformRowComponent, IconComponent],
  templateUrl: './extra-uniform-list.component.html',
  styleUrl: './extra-uniform-list.component.scss',
})
export class ExtraUniformListComponent {
  private readonly catalog = inject(IndentCatalogService);
  private readonly cart = inject(CartStore);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  readonly search = input('');

  protected readonly uniforms = signal<ExtraUniform[]>([]);
  protected readonly loading = signal(true);
  protected readonly skeletons = [1, 2, 3, 4];

  protected readonly form = this.fb.group({
    items: this.fb.array<FormGroup>([]),
  });

  protected readonly rows = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.uniforms()
      .map((uniform, index) => ({ uniform, index }))
      .filter(
        ({ uniform }) =>
          !term ||
          uniform.name.toLowerCase().includes(term) ||
          uniform.code.toLowerCase().includes(term),
      );
  });

  protected readonly cartQuantities = computed(() => {
    const quantities = new Map<string, number>();
    for (const line of this.cart.extraUniformLines()) {
      quantities.set(line.refId, (quantities.get(line.refId) ?? 0) + line.quantity);
    }
    return quantities;
  });

  constructor() {
    this.catalog
      .getExtraUniforms()
      .pipe(takeUntilDestroyed())
      .subscribe((uniforms) => {
        this.uniforms.set(uniforms);
        this.buildForm(uniforms);
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
    const uniform = this.uniforms()[index];

    if (group.invalid) {
      group.markAllAsTouched();
      this.toast.show('Select a size and a valid quantity first.', 'error');
      return;
    }

    const size = group.get('size')?.value as string | null;
    const quantity = Number(group.get('quantity')?.value ?? 0);

    if (!size || quantity <= 0) {
      return;
    }

    this.cart.addExtraUniform(uniform, size, quantity);
    group.reset({ uniformId: uniform.id, size: null, quantity: 0 });
    this.toast.show(`${uniform.name} (size ${size}) added to cart (${quantity}).`);
  }

  private buildForm(uniforms: ExtraUniform[]): void {
    this.items.clear();
    for (const uniform of uniforms) {
      this.items.push(
        this.fb.group({
          uniformId: [uniform.id],
          size: [null as string | null, [Validators.required]],
          quantity: [
            0,
            [Validators.required, Validators.min(0), Validators.max(uniform.maxQuantity)],
          ],
        }),
      );
    }
  }
}
