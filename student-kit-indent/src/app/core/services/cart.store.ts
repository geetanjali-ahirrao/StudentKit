import { Injectable, computed, signal } from '@angular/core';
import {
  AssignedUniforms,
  CartLine,
  CartTotals,
  ExtraUniform,
  StudentKit,
  UniformSlot,
  UniformType,
} from '../models/indent.models';

const UNIFORM_TYPES: UniformType[] = ['Summer', 'Sport'];
const NO_UNIFORMS: AssignedUniforms = { summer: 0, sport: 0 };

/**
 * Single source of truth for the indent cart.
 *
 * State is held in signals, everything the UI needs is a `computed` derived
 * from those signals, and mutations only happen through the methods below.
 */
@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly linesState = signal<CartLine[]>([]);
  /** Uniform slot key -> selected size. Kept apart from the lines so that
   *  editing a kit quantity never loses the sizes already chosen. */
  private readonly sizeState = signal<Record<string, string>>({});

  readonly lines = this.linesState.asReadonly();

  readonly kitLines = computed(() => this.linesState().filter((line) => line.type === 'KIT'));

  readonly extraUniformLines = computed(() =>
    this.linesState().filter((line) => line.type === 'EXTRA_UNIFORM'),
  );

  readonly isEmpty = computed(() => this.linesState().length === 0);

  /** One entry per uniform the centre has to issue for the kits in the cart. */
  readonly uniformSlots = computed<UniformSlot[]>(() => {
    const sizes = this.sizeState();
    const slots: UniformSlot[] = [];

    for (const line of this.kitLines()) {
      const assigned = line.assignedUniforms ?? NO_UNIFORMS;

      for (const uniformType of UNIFORM_TYPES) {
        const perKit = uniformType === 'Summer' ? assigned.summer : assigned.sport;
        const total = perKit * line.quantity;

        for (let setNumber = 1; setNumber <= total; setNumber++) {
          const key = `${line.lineId}|${uniformType}|${setNumber}`;
          slots.push({
            key,
            lineId: line.lineId,
            kitCode: line.code,
            kitName: line.name,
            uniformType,
            setNumber,
            size: sizes[key] ?? null,
          });
        }
      }
    }

    return slots;
  });

  readonly totals = computed<CartTotals>(() => {
    const slots = this.uniformSlots();
    return {
      kitQuantity: this.sum(this.kitLines()),
      uniformQuantity: slots.length,
      extraUniformQuantity: this.sum(this.extraUniformLines()),
      pendingUniformQuantity: slots.filter((slot) => !slot.size).length,
      amount: this.linesState().reduce((total, line) => total + line.unitPrice * line.quantity, 0),
    };
  });

  /** Total number of pieces in the cart - used by the header cart badge. */
  readonly itemCount = computed(
    () => this.totals().kitQuantity + this.totals().extraUniformQuantity,
  );

  readonly canPlaceIndent = computed(
    () => !this.isEmpty() && this.totals().pendingUniformQuantity === 0,
  );

  /** Quantity of a kit already in the cart, so a row can show its own state. */
  quantityOf(refId: string): number {
    return this.linesState()
      .filter((line) => line.refId === refId)
      .reduce((total, line) => total + line.quantity, 0);
  }

  addKit(kit: StudentKit, quantity: number): void {
    if (quantity <= 0) {
      return;
    }

    this.linesState.update((lines) => {
      const existing = lines.find((line) => line.type === 'KIT' && line.refId === kit.id);

      if (existing) {
        return lines.map((line) =>
          line.lineId === existing.lineId
            ? { ...line, quantity: Math.min(line.quantity + quantity, kit.maxQuantity) }
            : line,
        );
      }

      return [
        ...lines,
        {
          lineId: this.newLineId('kit'),
          refId: kit.id,
          type: 'KIT' as const,
          code: kit.code,
          name: kit.name,
          detail: kit.term,
          unitPrice: kit.kitPrice,
          quantity: Math.min(quantity, kit.maxQuantity),
          assignedUniforms: { ...kit.assignedUniforms },
        },
      ];
    });
  }

  addExtraUniform(uniform: ExtraUniform, size: string, quantity: number): void {
    if (quantity <= 0 || !size) {
      return;
    }

    this.linesState.update((lines) => {
      const existing = lines.find(
        (line) =>
          line.type === 'EXTRA_UNIFORM' && line.refId === uniform.id && line.detail === `Size ${size}`,
      );

      if (existing) {
        return lines.map((line) =>
          line.lineId === existing.lineId
            ? { ...line, quantity: Math.min(line.quantity + quantity, uniform.maxQuantity) }
            : line,
        );
      }

      return [
        ...lines,
        {
          lineId: this.newLineId('uni'),
          refId: uniform.id,
          type: 'EXTRA_UNIFORM' as const,
          code: uniform.code,
          name: uniform.name,
          detail: `Size ${size}`,
          unitPrice: uniform.price,
          quantity: Math.min(quantity, uniform.maxQuantity),
        },
      ];
    });
  }

  updateQuantity(lineId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeLine(lineId);
      return;
    }

    this.linesState.update((lines) =>
      lines.map((line) => (line.lineId === lineId ? { ...line, quantity } : line)),
    );
  }

  removeLine(lineId: string): void {
    this.linesState.update((lines) => lines.filter((line) => line.lineId !== lineId));
    this.sizeState.update((sizes) => {
      const next: Record<string, string> = {};
      for (const [key, size] of Object.entries(sizes)) {
        if (!key.startsWith(`${lineId}|`)) {
          next[key] = size;
        }
      }
      return next;
    });
  }

  setUniformSize(key: string, size: string): void {
    this.sizeState.update((sizes) => ({ ...sizes, [key]: size }));
  }

  /** Applies one size to every uniform slot that is still unallocated. */
  applySizeToPending(size: string): void {
    const pending = this.uniformSlots().filter((slot) => !slot.size);
    if (!pending.length) {
      return;
    }

    this.sizeState.update((sizes) => {
      const next = { ...sizes };
      for (const slot of pending) {
        next[slot.key] = size;
      }
      return next;
    });
  }

  clear(): void {
    this.linesState.set([]);
    this.sizeState.set({});
  }

  private sum(lines: CartLine[]): number {
    return lines.reduce((total, line) => total + line.quantity, 0);
  }

  private newLineId(prefix: string): string {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }
}
