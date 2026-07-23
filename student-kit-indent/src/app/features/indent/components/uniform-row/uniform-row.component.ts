import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ExtraUniform } from '../../../../core/models/indent.models';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { InrPipe } from '../../../../shared/pipes/inr.pipe';
import { QuantitySelectorComponent } from '../../../../shared/components/quantity-selector/quantity-selector.component';

/** One extra-uniform line inside the New Indent table. */
@Component({
  selector: 'app-uniform-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, IconComponent, InrPipe, QuantitySelectorComponent],
  templateUrl: './uniform-row.component.html',
  styleUrl: './uniform-row.component.scss',
})
export class UniformRowComponent {
  readonly uniform = input.required<ExtraUniform>();
  readonly group = input.required<FormGroup>();
  readonly inCart = input(0);

  readonly add = output<void>();

  protected get sizeControl(): FormControl<string | null> {
    return this.group().get('size') as FormControl<string | null>;
  }

  protected get quantityControl(): FormControl<number | null> {
    return this.group().get('quantity') as FormControl<number | null>;
  }

  protected get quantity(): number {
    const value = this.quantityControl.value;
    return typeof value === 'number' && Number.isFinite(value) ? value : 0;
  }

  protected get subtotal(): number {
    return this.quantity * this.uniform().price;
  }

  protected get showSizeError(): boolean {
    const control = this.sizeControl;
    return control.invalid && (control.dirty || control.touched);
  }

  protected get showQuantityError(): boolean {
    const control = this.quantityControl;
    return control.invalid && (control.dirty || control.touched);
  }

  protected get quantityError(): string {
    const errors = this.quantityControl.errors ?? {};
    if (errors['max']) {
      return `Maximum ${this.uniform().maxQuantity} per line.`;
    }
    if (errors['min']) {
      return 'Quantity cannot be negative.';
    }
    return 'Enter a quantity.';
  }

  protected get canAdd(): boolean {
    return this.group().valid && this.quantity > 0;
  }

  protected onAdd(): void {
    this.add.emit();
  }
}
