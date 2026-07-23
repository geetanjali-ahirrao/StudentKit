import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StudentKit } from '../../../../core/models/indent.models';
import { InrPipe } from '../../../../shared/pipes/inr.pipe';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { QuantitySelectorComponent } from '../../../../shared/components/quantity-selector/quantity-selector.component';

/** One student kit line inside the New Indent table. */
@Component({
  selector: 'app-kit-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, IconComponent, InrPipe, QuantitySelectorComponent],
  templateUrl: './kit-row.component.html',
  styleUrl: './kit-row.component.scss',
})
export class KitRowComponent {
  readonly kit = input.required<StudentKit>();
  readonly group = input.required<FormGroup>();
  /** Quantity of this kit already sitting in the cart. */
  readonly inCart = input(0);

  readonly add = output<void>();

  protected get quantityControl(): FormControl<number | null> {
    return this.group().get('quantity') as FormControl<number | null>;
  }

  protected get quantity(): number {
    const value = this.quantityControl.value;
    return typeof value === 'number' && Number.isFinite(value) ? value : 0;
  }

  protected get subtotal(): number {
    return this.quantity * this.kit().kitPrice;
  }

  protected get showError(): boolean {
    const control = this.quantityControl;
    return control.invalid && (control.dirty || control.touched);
  }

  protected get errorMessage(): string | null {
    const errors = this.quantityControl.errors;
    if (!errors) {
      return null;
    }
    if (errors['required']) {
      return 'Enter a quantity.';
    }
    if (errors['max']) {
      return `Maximum ${this.kit().maxQuantity} kits per line.`;
    }
    if (errors['min']) {
      return 'Quantity cannot be negative.';
    }
    return 'Enter a valid quantity.';
  }

  protected get canAdd(): boolean {
    return this.quantityControl.valid && this.quantity > 0;
  }

  protected onAdd(): void {
    this.add.emit();
  }
}
