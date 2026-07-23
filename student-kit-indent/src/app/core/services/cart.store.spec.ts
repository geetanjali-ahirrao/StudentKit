import { TestBed } from '@angular/core/testing';
import { EXTRA_UNIFORMS, STUDENT_KITS } from '../data/indent-catalog';
import { CartStore } from './cart.store';

describe('CartStore', () => {
  let store: CartStore;

  const developingRoots = STUDENT_KITS[0]; // no uniforms assigned
  const emergingWings = STUDENT_KITS[1]; // 1 summer + 1 sport
  const summerUniform = EXTRA_UNIFORMS[0];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(CartStore);
    store.clear();
  });

  it('starts empty', () => {
    expect(store.isEmpty()).toBeTrue();
    expect(store.totals().amount).toBe(0);
    expect(store.totals().kitQuantity).toBe(0);
  });

  it('bills the kit price and ignores the royalty', () => {
    store.addKit(developingRoots, 1);

    expect(store.totals().amount).toBe(developingRoots.kitPrice);
    expect(store.totals().amount).not.toBe(developingRoots.kitPrice + developingRoots.royalty);
  });

  it('merges repeat additions of the same kit into one line', () => {
    store.addKit(developingRoots, 1);
    store.addKit(developingRoots, 2);

    expect(store.kitLines().length).toBe(1);
    expect(store.totals().kitQuantity).toBe(3);
  });

  it('never lets a line go past the kit maximum', () => {
    store.addKit(developingRoots, 4);
    store.addKit(developingRoots, 4);

    expect(store.totals().kitQuantity).toBe(developingRoots.maxQuantity);
  });

  it('ignores a quantity of zero or less', () => {
    store.addKit(developingRoots, 0);
    store.addKit(developingRoots, -3);

    expect(store.isEmpty()).toBeTrue();
  });

  it('creates one uniform slot per assigned uniform per kit', () => {
    store.addKit(emergingWings, 2);

    expect(store.uniformSlots().length).toBe(4);
    expect(store.totals().uniformQuantity).toBe(4);
    expect(store.totals().pendingUniformQuantity).toBe(4);
    expect(store.canPlaceIndent()).toBeFalse();
  });

  it('clears the pending count once every slot has a size', () => {
    store.addKit(emergingWings, 1);
    store.applySizeToPending('22');

    expect(store.totals().pendingUniformQuantity).toBe(0);
    expect(store.canPlaceIndent()).toBeTrue();
    expect(store.uniformSlots().every((slot) => slot.size === '22')).toBeTrue();
  });

  it('keeps sizes already chosen when the kit quantity grows', () => {
    store.addKit(emergingWings, 1);
    store.applySizeToPending('20');
    store.addKit(emergingWings, 1);

    const sized = store.uniformSlots().filter((slot) => slot.size === '20');
    expect(store.uniformSlots().length).toBe(4);
    expect(sized.length).toBe(2);
  });

  it('keeps extra uniforms of different sizes on separate lines', () => {
    store.addExtraUniform(summerUniform, '22', 1);
    store.addExtraUniform(summerUniform, '24', 2);
    store.addExtraUniform(summerUniform, '22', 1);

    expect(store.extraUniformLines().length).toBe(2);
    expect(store.totals().extraUniformQuantity).toBe(4);
  });

  it('requires a size before an extra uniform is accepted', () => {
    store.addExtraUniform(summerUniform, '', 2);

    expect(store.extraUniformLines().length).toBe(0);
  });

  it('drops the line and its sizes when it is removed', () => {
    store.addKit(emergingWings, 1);
    store.applySizeToPending('24');
    store.removeLine(store.kitLines()[0].lineId);

    expect(store.isEmpty()).toBeTrue();
    expect(store.uniformSlots().length).toBe(0);
  });

  it('totals kits and extra uniforms together', () => {
    store.addKit(developingRoots, 2); // 2 x 1000
    store.addExtraUniform(summerUniform, '22', 1); // 1 x 850

    expect(store.totals().amount).toBe(2 * developingRoots.kitPrice + summerUniform.price);
    expect(store.itemCount()).toBe(3);
  });
});
