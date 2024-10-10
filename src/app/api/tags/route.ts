import { NextRequest } from 'next/server';

import db from '@/lib/db';
import { HandlerApiError, HandlerApiResponse } from '@/utils/handlerResponse';

export async function GET(req: NextRequest) {
  try {
    /** Get all available tags */
    const tags = await db.tag.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
      },
    });

    return HandlerApiResponse.success(tags);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return HandlerApiError.internalServerError();
  }
}
