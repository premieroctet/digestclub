import client from '@/lib/db';
import { checkDigest, checkTeam } from '@/lib/middleware';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import {
  DigestBlock,
  Digest,
  DigestBlockType,
  BookmarkDigestStyle,
} from '@prisma/client';
import type { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { orderBlock } from '../order';

export type ApiBookmarkDigestResponseSuccess = DigestBlock;
export const router = createRouter<AuthApiRequest, NextApiResponse>();

type PostBody = {
  bookmarkId?: string;
  text?: string;
  position?: number;
  type: DigestBlockType;
  style?: BookmarkDigestStyle;
};

const createDigestBlock = async (
  body: PostBody,
  digest: Digest & {
    digestBlocks: DigestBlock[];
  }
) => {
  const block = await client.digestBlock.create({
    data: {
      digestId: digest.id,
      ...(body.bookmarkId && { bookmarkId: body.bookmarkId }),
      ...(body.text && { text: body.text }),
      ...(body.style && { style: body.style }),
      order: digest.digestBlocks.length,
      type: body.type,
    },
  });

  if (body.position !== undefined) {
    await orderBlock(digest.id, block.id, body.position);
  }
  return block;
};

router
  .use(checkTeam)
  .use(checkDigest)
  .post(async (req, res) => {
    try {
      const { bookmarkId, text, position, type, style } = req.body as PostBody;
      const { teamId, digestId } = req.query as {
        teamId: string;
        digestId: string;
      };

      const digest = await client.digest.findFirstOrThrow({
        where: {
          id: digestId,
          teamId: teamId,
        },
        include: {
          digestBlocks: true,
        },
      });

      let createdBlock: DigestBlock;

      switch (type) {
        case DigestBlockType.BOOKMARK:
          if (!bookmarkId) return res.end(400);
          const bookmark = await client.bookmark.findFirstOrThrow({
            where: {
              id: bookmarkId,
              teamId,
            },
          });
          if (bookmark.teamId !== digest.teamId) return res.end(400);
          createdBlock = await createDigestBlock(
            { type: DigestBlockType.BOOKMARK, bookmarkId, position, style },
            digest
          );
          break;

        case DigestBlockType.TEXT:
          if (!text) return res.end(400);
          createdBlock = await createDigestBlock(
            { type: DigestBlockType.TEXT, text, position },
            digest
          );
          break;

        default:
          return res.status(400).json({ error: 'Invalid block type' });
      }
      return res.status(200).json(createdBlock);
    } catch (error) {
      return res.end(500);
    }
  });

export default router.handler({
  onError: errorHandler,
});
