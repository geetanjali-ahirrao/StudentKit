import { InrPipe } from './inr.pipe';

describe('InrPipe', () => {
  const pipe = new InrPipe();

  it('uses the screen placeholder for zero', () => {
    expect(pipe.transform(0)).toBe('\u20B900.00');
    expect(pipe.transform(0, 0)).toBe('\u20B900');
  });

  it('treats null and undefined as zero', () => {
    expect(pipe.transform(null)).toBe('\u20B900.00');
    expect(pipe.transform(undefined)).toBe('\u20B900.00');
  });

  it('formats amounts with two decimals by default', () => {
    expect(pipe.transform(1000)).toBe('\u20B91,000.00');
  });

  it('drops the decimals when asked', () => {
    expect(pipe.transform(1500, 0)).toBe('\u20B91,500');
  });

  it('groups lakhs the Indian way', () => {
    expect(pipe.transform(150000, 0)).toBe('\u20B91,50,000');
  });
});
