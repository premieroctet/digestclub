import client from '@/lib/db';
import { checkTeam } from '@/lib/middleware';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { Bookmark } from '@prisma/client';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

export type ApiBookmarkResponseSuccess = Bookmark;

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router.use(checkTeam).delete(async (req, res) => {
  const bookmarkId = req.query.bookmarkId as string;
  const teamId = req.query.teamId as string;

  const bookmark = await client.bookmark.findFirstOrThrow({
    where: {
      id: bookmarkId,
      teamId,
    },
  });

  const deletedBookmark = await client.bookmark.delete({
    where: {
      id: bookmark.id,
    },
  });

  return res.status(201).json(deletedBookmark);
});

export default router.handler({
  onError: errorHandler,
});
