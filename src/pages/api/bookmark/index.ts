import { AuthApiRequest, errorHandler } from '@/lib/router';
import { saveBookmark } from '@/utils/bookmark';
import { Bookmark } from '@prisma/client';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import * as Sentry from '@sentry/nextjs';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';
export type ApiBookmarkResponseSuccess = Bookmark;

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router.post(async (req, res) => {
  if (!process.env.JWT_SECRET) return res.status(500).end();
  if (
    req.headers.authorization !== undefined &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    const authHeader = req.headers.authorization;
    const token = authHeader.substring(7, authHeader.length);
    // check if the token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).end();

    const { teamId } = decoded as { teamId: string };
    if (!teamId) return res.status(401).end();

    const { linkUrl } = JSON.parse(req.body);
    if (!linkUrl) return res.status(400).end();

    try {
      const team = await db.team.findFirst({
        where: {
          id: teamId,
        },
      });
      if (!team) return res.status(401).end();
      const bookmark = await saveBookmark(linkUrl, teamId);
      return res.status(201).json(bookmark);
    } catch (error: unknown) {
      Sentry.captureException(error);
      // eslint-disable-next-line no-console
      console.log(error);
      return res.status(400).json({
        error: 'Invalid link',
      });
    }
  }
});

export default router.handler({
  onError: errorHandler,
});
