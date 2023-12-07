import Metascraper, { Metadata } from 'metascraper';
import MetascraperTwitter from 'metascraper-twitter';
import MetascraperTitle from 'metascraper-title';
import MetascraperDescription from 'metascraper-description';
import MetascraperImage from 'metascraper-image';
import MetascrapperLogoFavicon from 'metascraper-logo-favicon';

const metascraper = Metascraper([
  MetascraperTwitter(),
  MetascraperTitle(),
  MetascraperDescription(),
  MetascraperImage(),
  MetascrapperLogoFavicon(),
]);

const getHtml = async (url: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // timeout if it takes longer than 5 seconds

  return await fetch(url, {
    signal: controller.signal,
    headers: {
      'User-Agent': 'digestclub-bot/1.0',
    },
  }).then((res) => {
    clearTimeout(timeoutId);
    return res.text();
  });
};

export const extractMetadata = async (url: string) => {
  const html = await getHtml(url);
  const metadata = (await metascraper({
    html,
    url,
  })) as any as Metadata & { logo: string };
  /* the metascraper types are wrong, logo isn't in Metadata interface (cf. https://github.com/microlinkhq/metascraper/issues/657) */

  if (!metadata) {
    return null;
  }

  return {
    title: metadata.title,
    description: metadata.description,
    image: metadata.image,
    logo: metadata.logo,
  };
};
