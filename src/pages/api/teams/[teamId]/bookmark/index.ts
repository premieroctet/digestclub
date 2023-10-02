import { checkTeam } from '@/lib/middleware';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { saveBookmark } from '@/utils/bookmark';
import { Bookmark } from '@prisma/client';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import * as Sentry from '@sentry/nextjs';
import messages from '@/messages/en';

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
    // eslint-disable-next-line no-console
    console.log(error);
    const error_code = (error as TypeError)
      .message as keyof typeof messages.bookmark.create.error;

    Sentry.captureMessage(
      `Failed to save bookmark. Cause: ${
        messages.bookmark.create.error[error_code] ??
        (error as TypeError).message
      } (${linkUrl})`
    );

    return res.status(400).json({
      error:
        messages.bookmark.create.error[error_code] ?? messages['default_error'],
    });
  }
});

export default router.handler({
  onError: errorHandler,
});
