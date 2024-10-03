import { getDomainFromUrl, isPdfUrl } from '@/utils/url';
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

describe('isPdfUrl', () => {
  it('should return true for valid PDF URLs', () => {
    // Test cases where the URL ends with '.pdf'
    expect(isPdfUrl('https://example.com/file.pdf')).toBe(true);
    expect(isPdfUrl('http://www.test.com/doc.pdf')).toBe(true);
    expect(isPdfUrl('ftp://ftp.site.com/report.pdf')).toBe(true);
  });

  it('should return false for invalid PDF URLs', () => {
    // Test cases where the URL does not end with '.pdf'
    expect(isPdfUrl('https://example.com/document.pdfx')).toBe(false);
    expect(isPdfUrl('http://www.test.com/file.PDF')).toBe(false); // Case-sensitive check
    expect(isPdfUrl('ftp://ftp.site.com/reportpdf')).toBe(false);
    expect(isPdfUrl('https://example.com/pdf')).toBe(false);
    expect(isPdfUrl('https://example.com/.pdf')).toBe(false);
    expect(isPdfUrl('https://example.com/pdf.')).toBe(false);
  });
});
