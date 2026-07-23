import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UNIFORM_SIZES } from '../../../../core/data/indent-catalog';
import { UniformSlot } from '../../../../core/models/indent.models';
import { CartStore } from '../../../../core/services/cart.store';
import { ToastService } from '../../../../core/services/toast.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { InrPipe } from '../../../../shared/pipes/inr.pipe';

interface SlotGroup {
  lineId: string;
  title: string;
  slots: UniformSlot[];
}

/**
 * Second step of the indent: every uniform that comes with a kit needs a size
 * before the indent can be placed.
 */
@Component({
  selector: 'app-uniform-section-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, IconComponent, InrPipe],
  templateUrl: './uniform-section.page.html',
  styleUrl: './uniform-section.page.scss',
})
export class UniformSectionPage {
  private readonly cart = inject(CartStore);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly sizes = UNIFORM_SIZES;
  protected readonly totals = this.cart.totals;
  protected readonly isEmpty = this.cart.isEmpty;
  protected readonly canPlaceIndent = this.cart.canPlaceIndent;
  protected readonly bulkSize = new FormControl<string | null>(null);
  protected readonly submitted = signal(false);

  protected readonly groups = computed<SlotGroup[]>(() => {
    const groups = new Map<string, SlotGroup>();

    for (const slot of this.cart.uniformSlots()) {
      const group = groups.get(slot.lineId) ?? {
        lineId: slot.lineId,
        title: `${slot.kitCode} - ${slot.kitName}`,
        slots: [],
      };
      group.slots.push(slot);
      groups.set(slot.lineId, group);
    }

    return [...groups.values()];
  });

  protected onSizeChange(slot: UniformSlot, event: Event): void {
    const size = (event.target as HTMLSelectElement).value;
    if (size) {
      this.cart.setUniformSize(slot.key, size);
    }
  }

  protected applyToPending(): void {
    const size = this.bulkSize.value;

    if (!size) {
      this.toast.show('Choose a size to apply.', 'error');
      return;
    }

    const pending = this.totals().pendingUniformQuantity;
    this.cart.applySizeToPending(size);
    this.toast.show(`Size ${size} applied to ${pending} pending uniform(s).`);
  }

  protected placeIndent(): void {
    this.submitted.set(true);

    if (!this.canPlaceIndent()) {
      this.toast.show('Assign a size to every pending uniform first.', 'error');
      return;
    }

    const reference = `IND-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    this.cart.clear();
    this.submitted.set(false);
    this.toast.show(`Indent ${reference} placed.`);
    void this.router.navigate(['/indent/new']);
  }
}
