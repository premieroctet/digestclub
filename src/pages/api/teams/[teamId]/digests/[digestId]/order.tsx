import client from '@/lib/db';
import { checkDigest, checkTeam } from '@/lib/middleware';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { reorderList } from '@/utils/actionOnList';
import type { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import * as Sentry from '@sentry/nextjs';

export const router = createRouter<AuthApiRequest, NextApiResponse>();

export type OrderData = { blockId: string; position: number };

export const orderBlock = async (
  digestId: string,
  blockId: string,
  position: number
) => {
  const digestBlocks = await client.digestBlock.findMany({
    where: {
      digestId: digestId,
    },
    orderBy: {
      order: 'asc',
    },
  });

  if (digestBlocks) {
    const bookmarkDigestMoved = digestBlocks.find(
      (bookmarkDigest) => bookmarkDigest.id === blockId
    );

    if (bookmarkDigestMoved) {
      await client.$transaction(
        reorderList(digestBlocks, bookmarkDigestMoved.order, position).map(
          (currentBookmarkDigest, index) => {
            return client.digestBlock.updateMany({
              where: {
                id: currentBookmarkDigest.id,
                digestId: digestId,
              },
              data: { order: index },
            });
          }
        )
      );
    }
  }
};

export const indexBlock = async (digestId: string) => {
  const digestBlocks = await client.digestBlock.findMany({
    where: {
      digestId: digestId,
    },
    orderBy: {
      order: 'asc',
    },
  });

  if (digestBlocks) {
    return await client.$transaction(
      digestBlocks.map((currentBlockId, index) => {
        return client.digestBlock.updateMany({
          where: {
            id: currentBlockId.id,
            digestId: digestId,
          },
          data: { order: index },
        });
      })
    );
  }
};

router
  .use(checkTeam)
  .use(checkDigest)
  .post(async (req, res) => {
    try {
      const digestId = req.query.digestId as string;
      const { blockId, position } = req.body as {
        blockId: string;
        position: number;
      };
      const teamId = req.query.teamId as string;

      await client.digest.findFirstOrThrow({
        where: {
          id: digestId,
          teamId: teamId,
        },
      });

      const orderResult = await orderBlock(digestId, blockId, position);

      return res.status(201).json(orderResult);
    } catch (error) {
      Sentry.captureException(error);
      return res.status(500).json({
        error: 'Internal server error',
      });
    }
  });

export default router.handler({
  onError: errorHandler,
});
