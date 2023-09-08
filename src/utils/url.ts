export const getDomainFromUrl = (url: string) => {
  const hostname = new URL(url).hostname;
  const domain = hostname.split('.').slice(-2).join('.');

  return domain;
};
