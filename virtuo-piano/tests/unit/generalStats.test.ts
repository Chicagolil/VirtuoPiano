import { describe, it, expect } from 'vitest';
import { PIE_CHART_COLORS } from '@/common/constants/generalStats';

describe('General Stats Constants', () => {
  describe('PIE_CHART_COLORS', () => {
    it('should be an array of color strings', () => {
      expect(Array.isArray(PIE_CHART_COLORS)).toBe(true);
      expect(PIE_CHART_COLORS.length).toBeGreaterThan(0);
    });

    it('should contain valid hex color codes', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

      PIE_CHART_COLORS.forEach((color) => {
        expect(typeof color).toBe('string');
        expect(color).toMatch(hexColorRegex);
      });
    });

    it('should have the expected number of colors', () => {
      expect(PIE_CHART_COLORS).toHaveLength(5);
    });

    it('should contain the expected color values', () => {
      const expectedColors = [
        '#8884d8',
        '#82ca9d',
        '#ffc658',
        '#ff8042',
        '#ff4040',
      ];

      expect(PIE_CHART_COLORS).toEqual(expectedColors);
    });

    it('should have unique colors', () => {
      const uniqueColors = [...new Set(PIE_CHART_COLORS)];
      expect(uniqueColors).toHaveLength(PIE_CHART_COLORS.length);
    });

    it('should be accessible by index', () => {
      expect(PIE_CHART_COLORS[0]).toBe('#8884d8');
      expect(PIE_CHART_COLORS[1]).toBe('#82ca9d');
      expect(PIE_CHART_COLORS[2]).toBe('#ffc658');
      expect(PIE_CHART_COLORS[3]).toBe('#ff8042');
      expect(PIE_CHART_COLORS[4]).toBe('#ff4040');
    });

    it('should be immutable (frozen)', () => {
      // Tenter de modifier le tableau
      expect(() => {
        // @ts-ignore - Testing immutability
        PIE_CHART_COLORS.push('#000000');
      }).toThrow();
    });
  });
});
