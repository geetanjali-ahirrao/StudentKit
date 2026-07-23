import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

/**
 * Reusable stepper that plugs straight into reactive forms.
 *
 * It never silently corrects what is typed: the buttons stay inside the
 * allowed range, but a value typed by hand is passed to the form control as
 * it is, so the control's own validators decide what the user is told.
 */
@Component({
  selector: 'app-quantity-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuantitySelectorComponent),
      multi: true,
    },
  ],
  templateUrl: './quantity-selector.component.html',
  styleUrl: './quantity-selector.component.scss',
})
export class QuantitySelectorComponent implements ControlValueAccessor {
  readonly min = input(0);
  readonly max = input(5);
  readonly label = input('Quantity');
  readonly invalid = input(false);

  protected readonly display = signal('0');
  protected readonly disabled = signal(false);

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  protected get numericValue(): number | null {
    const raw = this.display().trim();
    return raw === '' ? null : Number(raw);
  }

  protected get canDecrease(): boolean {
    return !this.disabled() && (this.numericValue ?? this.min()) > this.min();
  }

  protected get canIncrease(): boolean {
    return !this.disabled() && (this.numericValue ?? this.min() - 1) < this.max();
  }

  writeValue(value: number | null): void {
    this.display.set(value === null || value === undefined ? '' : String(value));
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected step(delta: number): void {
    const current = this.numericValue ?? this.min();
    const next = Math.min(this.max(), Math.max(this.min(), current + delta));
    this.display.set(String(next));
    this.onTouched();
    this.onChange(next);
  }

  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/[^\d]/g, '').slice(0, 3);

    input.value = digitsOnly;
    this.display.set(digitsOnly);
    this.onChange(digitsOnly === '' ? null : Number(digitsOnly));
  }

  protected onBlur(): void {
    if (this.display().trim() === '') {
      this.display.set('0');
      this.onChange(0);
    }
    this.onTouched();
  }
}
