import { ExtraUniform, StudentKit } from '../models/indent.models';

/**
 * Static catalogue used by `IndentCatalogService`.
 *
 * The screen prints "Kit Price + Royalty = Rs.1,500" while a quantity of 1
 * subtotals to Rs.1,000 - so the kit price (Rs.1,000) is what gets billed and
 * the royalty (Rs.500) is only displayed alongside it.
 */
export const TERM_LABEL = 'Full Term: 2024 - 2025';

export const STUDENT_KITS: StudentKit[] = [
  {
    id: 'kit-dr',
    code: 'DR',
    name: 'Developing Roots',
    term: TERM_LABEL,
    kitPrice: 1000,
    royalty: 500,
    imageUrl: 'assets/kits/dr.svg',
    assignedUniforms: { summer: 0, sport: 0 },
    maxQuantity: 5,
  },
  {
    id: 'kit-ew',
    code: 'EW',
    name: 'Emerging Wings',
    term: TERM_LABEL,
    kitPrice: 1000,
    royalty: 500,
    imageUrl: 'assets/kits/ew.svg',
    assignedUniforms: { summer: 1, sport: 1 },
    maxQuantity: 5,
  },
  {
    id: 'kit-rtf1',
    code: 'RTF1',
    name: 'Ready to Fly 1',
    term: TERM_LABEL,
    kitPrice: 1000,
    royalty: 500,
    imageUrl: 'assets/kits/rtf1.svg',
    assignedUniforms: { summer: 1, sport: 1 },
    maxQuantity: 5,
  },
  {
    id: 'kit-rtf2',
    code: 'RTF2',
    name: 'Ready to Fly 2',
    term: TERM_LABEL,
    kitPrice: 1000,
    royalty: 500,
    imageUrl: 'assets/kits/rtf2.svg',
    assignedUniforms: { summer: 1, sport: 1 },
    maxQuantity: 5,
  },
];

export const UNIFORM_SIZES = ['18', '20', '22', '24', '26', '28', '30'];

export const EXTRA_UNIFORMS: ExtraUniform[] = [
  {
    id: 'uni-summer',
    code: 'SU',
    name: 'Summer Uniform Set',
    term: TERM_LABEL,
    price: 850,
    imageUrl: 'assets/kits/uniform-summer.svg',
    sizes: UNIFORM_SIZES,
    maxQuantity: 10,
  },
  {
    id: 'uni-winter',
    code: 'WU',
    name: 'Winter Uniform Set',
    term: TERM_LABEL,
    price: 1150,
    imageUrl: 'assets/kits/uniform-winter.svg',
    sizes: UNIFORM_SIZES,
    maxQuantity: 10,
  },
  {
    id: 'uni-sport',
    code: 'SP',
    name: 'Sports Uniform Set',
    term: TERM_LABEL,
    price: 750,
    imageUrl: 'assets/kits/uniform-sport.svg',
    sizes: UNIFORM_SIZES,
    maxQuantity: 10,
  },
  {
    id: 'uni-house',
    code: 'HT',
    name: 'House T-Shirt',
    term: TERM_LABEL,
    price: 450,
    imageUrl: 'assets/kits/uniform-house.svg',
    sizes: UNIFORM_SIZES,
    maxQuantity: 10,
  },
];
