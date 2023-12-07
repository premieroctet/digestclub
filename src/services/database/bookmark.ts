'use server';
import { extractMetadata } from '@/utils/bookmark';
import { isLinkValid } from '@/utils/link';
import { getPlaiceholder } from 'plaiceholder';
import db from '@/lib/db';

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
  await isBookmarkAlreadyInTeam(link?.id, teamId);

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

const isBookmarkAlreadyInTeam = async (linkId?: string, teamId?: string) => {
  if (!linkId || !teamId) return;

  return db.bookmark
    .findFirst({
      select: { id: true },
      where: {
        linkId: {
          equals: linkId,
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
