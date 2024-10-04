import db from '@/lib/db';
import { checkTeamAppRouter } from '@/lib/middleware';
import { HandlerApiError, HandlerApiResponse } from '@/utils/handlerResponse';
import { Bookmark } from '@prisma/client';
import { createEdgeRouter } from 'next-connect';
import { NextRequest } from 'next/server';

export type ResponseSuccess = Bookmark;

export interface TeamsRequestContext {
  params: {
    teamId: string;
    bookmarkId?: string;
  };

  // Not the best way to do this but it works for now
  // We need the middleware to set these values
  // Right now next-connect doesn't support generics to enrich the request (https://github.com/hoangvvo/next-connect/issues/230)
  membershipId: string;
  teamId: string;
  user: { id: string; email: string };
}

const router = createEdgeRouter<NextRequest, TeamsRequestContext>();

router.use(checkTeamAppRouter).delete(async (req, event, next) => {
  const bookmarkId = event.params.bookmarkId as string;
  const teamId = event.params.teamId as string;
  try {
    const bookmark = await db.bookmark.findFirstOrThrow({
      where: { id: bookmarkId, teamId },
    });

    const deletedBookmark = await db.bookmark.delete({
      where: { id: bookmark.id },
    });

    return HandlerApiResponse.success(deletedBookmark);
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.log(error);
    return HandlerApiError.internalServerError();
  }
});

export async function DELETE(request: NextRequest, ctx: TeamsRequestContext) {
  return router.run(request, ctx) as Promise<Response>;
}
