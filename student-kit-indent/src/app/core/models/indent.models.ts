/** Domain models for the Indent module. */

export type IndentItemType = 'KIT' | 'EXTRA_UNIFORM';

export type UniformType = 'Summer' | 'Sport';

/** Uniforms that come bundled with a student kit. */
export interface AssignedUniforms {
  summer: number;
  sport: number;
}

/** A student kit that can be indented for an academic term. */
export interface StudentKit {
  id: string;
  code: string;
  name: string;
  term: string;
  /** Billed to the centre. */
  kitPrice: number;
  /** Printed next to the kit price, not billed on the indent line. */
  royalty: number;
  imageUrl: string;
  assignedUniforms: AssignedUniforms;
  maxQuantity: number;
}

/** A uniform that can be ordered over and above the kit allocation. */
export interface ExtraUniform {
  id: string;
  code: string;
  name: string;
  term: string;
  price: number;
  imageUrl: string;
  sizes: string[];
  maxQuantity: number;
}

/** A single line inside the indent cart. */
export interface CartLine {
  lineId: string;
  refId: string;
  type: IndentItemType;
  code: string;
  name: string;
  /** Free-text qualifier shown under the name, e.g. the selected size. */
  detail?: string;
  unitPrice: number;
  quantity: number;
  assignedUniforms?: AssignedUniforms;
}

/** One uniform that has to be issued because a kit was added to the cart. */
export interface UniformSlot {
  key: string;
  lineId: string;
  kitCode: string;
  kitName: string;
  uniformType: UniformType;
  /** 1-based position within the kit line, e.g. "Set 2 of 3". */
  setNumber: number;
  size: string | null;
}

export interface CartTotals {
  kitQuantity: number;
  uniformQuantity: number;
  extraUniformQuantity: number;
  pendingUniformQuantity: number;
  amount: number;
}
