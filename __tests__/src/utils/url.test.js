import { getDomainFromUrl } from '@/utils/url';
import { describe, expect } from '@jest/globals';

describe('getDomainFromUrl', () => {
  it('should extract domain from a valid URL', () => {
    const url = 'https://www.example.com/path/to/resource';
    expect(getDomainFromUrl(url)).toBe('example.com');
  });

  it('should handle URL with protocol', () => {
    const url = 'http://subdomain.example.org';
    expect(getDomainFromUrl(url)).toBe('example.org');
  });
});
