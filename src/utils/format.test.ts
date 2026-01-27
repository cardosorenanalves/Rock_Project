import { abbreviateMiddle } from './format';

describe('format utils', () => {
  describe('abbreviateMiddle', () => {
    it('should not abbreviate short strings', () => {
      const short = '12345';
      expect(abbreviateMiddle(short)).toBe(short);
    });

    it('should abbreviate long strings', () => {
      const long = '1'.repeat(100);
      const result = abbreviateMiddle(long, 5, 5, 20);
      expect(result).toHaveLength(11); // 5 + 1 (ellipsis) + 5
      expect(result).toMatch(/^1{5}…1{5}$/);
    });

    it('should respect custom start and end lengths', () => {
      const long = 'abcdefghijklmnopqrstuvwxyz';
      const result = abbreviateMiddle(long, 2, 2, 10);
      expect(result).toBe('ab…yz');
    });

    it('should return original string if length is below threshold', () => {
      const s = '1234567890';
      // threshold 20, length 10 -> should return original
      expect(abbreviateMiddle(s, 2, 2, 20)).toBe(s);
    });
  });
});
