import { digitsOfPerfect, perfectFromP, getPerfectPrefix, getPerfectSuffix } from './digits';

describe('digits utils', () => {
  describe('digitsOfPerfect', () => {
    it('should calculate correct number of digits for small p', () => {
      // p=2 -> 6 (1 digit)
      expect(digitsOfPerfect(2)).toBe(1);
      // p=3 -> 28 (2 digits)
      expect(digitsOfPerfect(3)).toBe(2);
      // p=5 -> 496 (3 digits)
      expect(digitsOfPerfect(5)).toBe(3);
      // p=7 -> 8128 (4 digits)
      expect(digitsOfPerfect(7)).toBe(4);
      // p=13 -> 33550336 (8 digits)
      expect(digitsOfPerfect(13)).toBe(8);
    });
  });

  describe('perfectFromP', () => {
    it('should generate correct perfect numbers for small p', () => {
      expect(perfectFromP(2)).toBe(BigInt(6));
      expect(perfectFromP(3)).toBe(BigInt(28));
      expect(perfectFromP(5)).toBe(BigInt(496));
      expect(perfectFromP(7)).toBe(BigInt(8128));
    });
  });

  describe('getPerfectSuffix', () => {
    it('should return correct suffix', () => {
      // 496 ends with 6
      expect(getPerfectSuffix(5, 1)).toBe('6');
      // 496 ends with 96
      expect(getPerfectSuffix(5, 2)).toBe('96');
      // 8128 ends with 28
      expect(getPerfectSuffix(7, 2)).toBe('28');
    });
  });

  describe('getPerfectPrefix', () => {
    it('should return correct prefix for sufficiently large p', () => {
      // p=7 -> 8128 (Approx 2^13 = 8192) -> Prefix matches '81'
      expect(getPerfectPrefix(7, 2)).toBe('81');
      
      // p=13 -> 33550336 (Approx 2^25 = 33554432) -> Prefix matches '33'
      expect(getPerfectPrefix(13, 2)).toBe('33');
    });
  });
});
