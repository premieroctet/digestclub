import db from '@/lib/db';
import { checkTeam } from '@/lib/middleware';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { Bookmark } from '@prisma/client';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import * as Sentry from '@sentry/nextjs';
import jwt from 'jsonwebtoken';

export type ApiBookmarkResponseSuccess = Bookmark;

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router.use(checkTeam).get(async (req, res) => {
  if (!process.env.JWT_SECRET) return res.status(500);
  try {
    const token = jwt.sign({ teamId: req.teamId }, process.env.JWT_SECRET);

    const team = await db.team.update({
      where: { id: req.teamId },
      data: {
        apiKey: token,
      },
    });

    return res.status(200).json({ team });
  } catch (err) {
    Sentry.captureException(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router.handler({
  onError: errorHandler,
});
