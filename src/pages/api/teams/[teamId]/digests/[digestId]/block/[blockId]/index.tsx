import client from '@/lib/db';
import { checkTeam } from '@/lib/middleware';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import type { NextApiResponse } from 'next';
import { isStringEmpty } from '@/utils/string';
import { createRouter } from 'next-connect';
import { indexBlock } from '../../order';
import { BookmarkDigestStyle, DigestBlockType } from '@prisma/client';
import { isTwitterLink } from '@/utils/link';

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router
  .use(checkTeam)
  .delete(async (req, res) => {
    const teamId = req.query.teamId as string;
    const digestId = req.query.digestId as string;
    const blockId = req.query.blockId as string;

    await client.digest.findFirstOrThrow({
      where: {
        id: digestId,
        teamId: teamId,
      },
    });

    const deletedBlock = await client.digestBlock.delete({
      where: {
        id: blockId,
      },
    });

    await indexBlock(digestId);

    return res.status(200).json(deletedBlock);
  })
  .patch(async (req, res) => {
    try {
      const teamId = req.query.teamId as string;
      const digestId = req.query.digestId as string;
      const blockId = req.query.blockId as string;

      await client.digest.findFirstOrThrow({
        where: {
          id: digestId,
          teamId: teamId,
        },
      });

      const block = await client.digestBlock.findFirstOrThrow({
        where: {
          id: blockId,
        },
      });

      if (block.type === DigestBlockType.BOOKMARK) {
        const { title, description, style, tags } = req.body as {
          title: string;
          description: string;
          style: BookmarkDigestStyle;
          tags: string[] /* Array of tag IDs */;
        };

        /* If the update is an update on the style to a tweet style, we need to check if this is a valid tweet url */
        if (
          block &&
          style === BookmarkDigestStyle.TWEET_EMBED &&
          block.style !== style
        ) {
          if (!block.bookmarkId)
            return res.status(404).json({ error: 'Block not found' });
          const bookmark = await client.bookmark.findFirst({
            where: {
              id: block.bookmarkId,
            },
            include: {
              link: true,
            },
          });
          if (!bookmark)
            return res.status(404).json({ error: 'Bookmark not found' });
          const isTweet = isTwitterLink(bookmark?.link?.url);
          if (!isTweet)
            return res.status(400).json({
              error: 'This bookmark is not a tweet, cannot be a tweet embed',
            });
        }

        if (isStringEmpty(title)) {
          return res.status(400).json({
            error: 'Title cannot be empty',
          });
        }

        const updatedBlock = await client.digestBlock.update({
          where: {
            id: block.id,
          },
          data: {
            title,
            description,
            style,
            tags: {
              set: tags.map((tag) => ({
                id: tag,
              })),
            },
          },
        });

        return res.status(200).json(updatedBlock);
      } else if (block.type === DigestBlockType.TEXT) {
        const { text } = req.body;

        if (isStringEmpty(text)) {
          return res.status(400).json({
            error: 'Title cannot be empty',
          });
        }

        const updatedBlock = await client.digestBlock.update({
          where: {
            id: block.id,
          },
          data: {
            text,
          },
        });

        return res.status(200).json(updatedBlock);
      } else {
        return res.end(400);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  });

export default router.handler({
  onError: errorHandler,
});
