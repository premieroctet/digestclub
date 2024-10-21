export const getDomainFromUrl = (url: string) => {
  const hostname = new URL(url).hostname;
  const domain = hostname.split('.').slice(-2).join('.');

  return domain;
};

export const isPdfUrl = (url: string): boolean => {
  const urlObject = new URL(url);
  const pathname = urlObject.pathname;
  const hasExtension = pathname.endsWith('.pdf');
  if (!hasExtension) return false;
  // Edge case for urls like https://example.com/.pdf should not be considered as pdf
  const hasFileName = pathname.split('/').pop() !== '.pdf';
  if (!hasFileName) return false;
  return hasExtension && hasFileName;
};