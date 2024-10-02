import db from '@/lib/db';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { saveBookmark } from '@/services/database/bookmark';
import {
  ApiError,
  InternalServerError,
  MissingParametersError,
  UnauthorizedError,
} from '@/utils/apiError';
import { Bookmark } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';
import jwt from 'jsonwebtoken';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import rateLimit from '../../../utils/rateLimit';

export type ApiBookmarkResponseSuccess = Bookmark;

export const router = createRouter<AuthApiRequest, NextApiResponse>();

const UNIQUE_TOKEN_PER_INTERVAL = 500; // 500 requests
const INTERVAL = 60000; // 1 minute
interface PostRequestBody {
  linkUrl: string;
}

const limiter = rateLimit({
  uniqueTokenPerInterval: UNIQUE_TOKEN_PER_INTERVAL,
  interval: INTERVAL,
});

router.post(async (req, res) => {
  const { JWT_SECRET } = process.env;
  const { authorization: authHeader } = req.headers;
  try {
    if (!JWT_SECRET) throw new InternalServerError();
    if (authHeader == undefined || !authHeader.startsWith('Bearer '))
      throw new UnauthorizedError();

    const token = authHeader.substring(7, authHeader.length);
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) throw new UnauthorizedError();

    const { teamId } = decoded as { teamId: string };
    if (!teamId) throw new UnauthorizedError();

    const { linkUrl } = req.body as PostRequestBody;
    if (!linkUrl) throw new MissingParametersError();

    await limiter.check(res, 30, token);

    const team = await db.team.findFirst({
      where: {
        id: teamId,
      },
    });
    if (!team) throw new UnauthorizedError();
    const bookmark = await saveBookmark(linkUrl, teamId);
    return res.status(201).json(bookmark);
  } catch (error: any) {
    // Error that can be thrown by frontend or backend code (no status code etc..)
    if (error instanceof TypeError) {
      return res.status(400).json({
        error: error.message,
      });
    }
    // Error specific to the API (rate limit exceeded etc..)
    else if (error instanceof ApiError) {
      Sentry.captureException(error);

      return res.status(error.status).json({
        error,
      });
    } else {
      // Unexpected error
      Sentry.captureException(error);

      return res.status(500).json({
        error: 'Something went wrong',
      });
    }
  }
});

export default router.handler({
  onError: errorHandler,
});
