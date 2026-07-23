import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a number as Indian rupees using the digit grouping the indent
 * screens use (1,50,000.00). Zero is rendered as the screen's own placeholder
 * form - "Rs.00.00" with decimals, "Rs.00" without.
 */
@Pipe({ name: 'inr' })
export class InrPipe implements PipeTransform {
  transform(value: number | null | undefined, decimals: 2 | 0 = 2): string {
    const amount = Number(value ?? 0);

    if (!Number.isFinite(amount)) {
      return decimals === 2 ? '\u20B900.00' : '\u20B900';
    }

    if (amount === 0) {
      return decimals === 2 ? '\u20B900.00' : '\u20B900';
    }

    const formatted = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);

    return `\u20B9${formatted}`;
  }
}
