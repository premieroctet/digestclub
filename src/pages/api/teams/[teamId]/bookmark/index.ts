import { checkTeam } from '@/lib/middleware';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { saveBookmark } from '@/utils/bookmark';
import { Bookmark } from '@prisma/client';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import * as Sentry from '@sentry/nextjs';

export type ApiBookmarkResponseSuccess = Bookmark;

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router.use(checkTeam).post(async (req, res) => {
  const { link: linkUrl } = req.body;

  if (!linkUrl) {
    return res.status(400).end();
  }

  try {
    const bookmark = await saveBookmark(linkUrl, req.teamId!, req.membershipId);
    return res.status(201).json(bookmark);
  } catch (error: unknown) {
    if ((error as TypeError).message !== 'invalid_link') {
      Sentry.captureMessage(
        `Failed to save bookmark. Cause: Invalid link (${linkUrl})`
      );
    }

    return res.status(400).json({
      error: 'Invalid link',
    });
  }
});

export default router.handler({
  onError: errorHandler,
});
