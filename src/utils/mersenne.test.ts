import { MERSENNE_P } from './mersenne';

describe('mersenne utils', () => {
  it('should be an array of numbers', () => {
    expect(Array.isArray(MERSENNE_P)).toBe(true);
    MERSENNE_P.forEach(p => {
      expect(typeof p).toBe('number');
    });
  });

  it('should contain known Mersenne exponents', () => {
    // First few known Mersenne exponents
    expect(MERSENNE_P).toContain(2);
    expect(MERSENNE_P).toContain(3);
    expect(MERSENNE_P).toContain(5);
    expect(MERSENNE_P).toContain(7);
    expect(MERSENNE_P).toContain(13);
  });

  it('should be sorted', () => {
    const sorted = [...MERSENNE_P].sort((a, b) => a - b);
    expect(MERSENNE_P).toEqual(sorted);
  });
});
