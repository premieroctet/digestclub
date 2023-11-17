import db from '@/lib/db';
import { getPlaiceholder } from 'plaiceholder';
import { isLinkValid } from './link';
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

const isBookmarkedByUser = async (
  linkId?: string,
  membershipId?: string,
  teamId?: string
) => {
  if (!linkId || !membershipId || !teamId) return;

  return db.bookmark
    .findFirst({
      select: { id: true },
      where: {
        linkId: {
          equals: linkId,
        },
        membershipId: {
          equals: membershipId,
        },
        teamId: {
          equals: teamId,
        },
      },
    })
    .then((response) => {
      // eslint-disable-next-line no-console
      console.log(response);
      if (response?.id) {
        throw new TypeError('already_bookmarked');
      }
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

export const saveBookmark = async (
  linkUrl: string,
  teamId: string,
  membershipId?: string,
  metadata?: object
) => {
  let link = await db.link.findFirst({
    select: { id: true },
    where: {
      url: {
        equals: linkUrl,
      },
    },
  });

  const response = await isLinkValid(linkUrl);
  await isBookmarkedByUser(link?.id, membershipId, teamId);

  if (!link) {
    const isPDF = response.headers.get('Content-Type') === 'application/pdf';
    const isText = response.headers.get('Content-Type')?.startsWith('text/');
    let blurhash = null;
    let metadata = null;
    if (!isPDF && !isText) throw new TypeError('invalid_content_type');

    if (!isPDF) {
      metadata = await extractMetadata(linkUrl);
    }

    if (metadata?.image) {
      try {
        const { base64 } = await getPlaiceholder(metadata.image, {
          size: 16,
        });

        blurhash = base64;
      } catch (e) {}
    }

    const logo = isPDF ? null : metadata?.logo;

    link = await db.link.create({
      data: {
        title: metadata?.title || linkUrl,
        image: metadata?.image || null,
        description: metadata?.description || '',
        url: linkUrl,
        logo,
        blurHash: blurhash,
      },
    });
  }

  const bookmark = await db.bookmark.create({
    data: {
      linkId: link.id,
      teamId,
      provider: membershipId ? 'WEB' : 'SLACK',
      ...(membershipId && { membershipId }),
      ...(metadata && { metadata }),
    },
  });

  return bookmark;
};
