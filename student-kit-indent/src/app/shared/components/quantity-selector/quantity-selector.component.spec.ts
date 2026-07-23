import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { QuantitySelectorComponent } from './quantity-selector.component';

@Component({
  imports: [ReactiveFormsModule, QuantitySelectorComponent],
  template: `<app-quantity-selector [formControl]="quantity" [min]="0" [max]="5" />`,
})
class HostComponent {
  readonly quantity = new FormControl<number | null>(0);
}

describe('QuantitySelectorComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const buttons = () => fixture.debugElement.queryAll(By.css('button'));
  const input = () => fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('writes the control value into the field', () => {
    host.quantity.setValue(3);
    fixture.detectChanges();

    expect(input().value).toBe('3');
  });

  it('increments and decrements through the control', () => {
    buttons()[1].nativeElement.click();
    fixture.detectChanges();
    expect(host.quantity.value).toBe(1);

    buttons()[0].nativeElement.click();
    fixture.detectChanges();
    expect(host.quantity.value).toBe(0);
  });

  it('disables the minus button at the minimum and plus at the maximum', () => {
    expect(buttons()[0].nativeElement.disabled).toBeTrue();

    host.quantity.setValue(5);
    fixture.detectChanges();
    expect(buttons()[1].nativeElement.disabled).toBeTrue();
  });

  it('keeps only digits when typing', () => {
    const field = input();
    field.value = '2a!3';
    field.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(field.value).toBe('23');
    expect(host.quantity.value).toBe(23);
  });

  it('falls back to zero when the field is cleared and blurred', () => {
    const field = input();
    field.value = '';
    field.dispatchEvent(new Event('input'));
    field.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(host.quantity.value).toBe(0);
  });

  it('respects a disabled control', () => {
    host.quantity.disable();
    fixture.detectChanges();

    expect(input().disabled).toBeTrue();
  });
});
