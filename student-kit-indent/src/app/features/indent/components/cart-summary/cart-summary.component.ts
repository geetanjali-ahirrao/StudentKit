import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartLine } from '../../../../core/models/indent.models';
import { CartStore } from '../../../../core/services/cart.store';
import { ToastService } from '../../../../core/services/toast.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { InrPipe } from '../../../../shared/pipes/inr.pipe';

/** Running total of the indent, shown under both tabs. */
@Component({
  selector: 'app-cart-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, InrPipe, RouterLink],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss',
})
export class CartSummaryComponent {
  private readonly cart = inject(CartStore);
  private readonly toast = inject(ToastService);

  protected readonly lines = this.cart.lines;
  protected readonly totals = this.cart.totals;
  protected readonly isEmpty = this.cart.isEmpty;

  protected typeLabel(line: CartLine): string {
    return line.type === 'KIT' ? 'Student Kit' : 'Extra Uniform';
  }

  protected remove(line: CartLine): void {
    this.cart.removeLine(line.lineId);
    this.toast.show(`${line.name} removed from the cart.`, 'info');
  }

  protected clear(): void {
    this.cart.clear();
    this.toast.show('Cart cleared.', 'info');
  }
}
