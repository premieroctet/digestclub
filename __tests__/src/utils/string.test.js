import { isStringEmpty, makeHidden } from '@/utils/string';
import { describe, expect } from '@jest/globals';

describe('isStringEmpty', () => {
  it('returns true for empty strings', () => {
    expect(isStringEmpty('')).toBe(true);
  });

  it('returns true for strings with only spaces', () => {
    expect(isStringEmpty('   ')).toBe(true);
  });

  it('returns false for non-empty strings', () => {
    expect(isStringEmpty('Hello')).toBe(false);
  });

  it('returns false for strings with spaces', () => {
    expect(isStringEmpty('   Hello   ')).toBe(false);
  });
});

describe('makeHidden', () => {
  it('replaces each character with *', () => {
    expect(makeHidden('hello')).toBe('*****');
  });

  it('works with empty string', () => {
    expect(makeHidden('')).toBe('');
  });

  it('replaces each character including spaces', () => {
    expect(makeHidden('Hello, world!')).toBe('*************');
  });

  it('handles Unicode characters', () => {
    expect(makeHidden('😊🌟')).toBe('**');
  });

  it('handles long strings', () => {
    expect(makeHidden('a'.repeat(100))).toBe('*'.repeat(100));
  });
});
