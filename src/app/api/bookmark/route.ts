import db from '@/lib/db';
import { saveBookmark } from '@/services/database/bookmark';
import { HandlerApiError, HandlerApiResponse } from '@/utils/handlerResponse';

import { Bookmark } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export type ApiBookmarkResponseSuccess = Bookmark;

// export const router = createRouter<AuthApiRequest, NextApiResponse>();

// const UNIQUE_TOKEN_PER_INTERVAL = 500; // 500 requests
// const INTERVAL = 60000; // 1 minute
// interface PostRequestBody {
//   linkUrl: string;
// }

// const limiter = rateLimit({
//   uniqueTokenPerInterval: UNIQUE_TOKEN_PER_INTERVAL,
//   interval: INTERVAL,
// });

export async function POST(req: NextRequest) {
  try {
    const { JWT_SECRET } = process.env;
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error();
    if (!JWT_SECRET) return HandlerApiError.unauthorized();
    const token = authHeader.substring(7, authHeader.length);
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) return HandlerApiError.unauthorized();

    const { teamId } = decoded as { teamId: string };
    if (!teamId) return HandlerApiError.internalServerError();

    const { linkUrl } = (await req.json()) as { linkUrl: string };
    if (!linkUrl) return HandlerApiError.missingParameters();

    // @todo implement rate limiting

    const team = await db.team.findFirst({
      where: {
        id: teamId,
      },
    });
    if (!team) throw new Error();
    const bookmark = await saveBookmark(linkUrl, teamId);
    return HandlerApiResponse.success(bookmark);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return HandlerApiError.internalServerError();
  }
}
