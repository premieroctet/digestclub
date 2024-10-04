import { checkTeamAppRouter } from '@/lib/middleware';
import messages from '@/messages/en';
import { saveBookmark } from '@/services/database/bookmark';
import { HandlerApiError, HandlerApiResponse } from '@/utils/handlerResponse';
import { Bookmark } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';
import { createEdgeRouter } from 'next-connect';
import type { NextRequest } from 'next/server';

export type ApiBookmarkResponseSuccess = Bookmark;

export interface TeamsRequestContext {
  params: {
    teamId: string;
  };

  // Not the best way to do this but it works for now
  // We need the middleware to set these values
  // Right now next-connect doesn't support generics to enrich the request (https://github.com/hoangvvo/next-connect/issues/230)
  membershipId: string;
  teamId: string;
  user: { id: string; email: string };
}

const router = createEdgeRouter<NextRequest, TeamsRequestContext>();

router.use(checkTeamAppRouter).post(async (req, event, next) => {
  const body = await req.json();
  const linkUrl = body.link as string;
  try {
    const teamId = event.params.teamId as string;
    const membershipId = event.membershipId as string;

    if (!linkUrl) {
      return HandlerApiError.badRequest();
    }

    const bookmark = await saveBookmark(linkUrl, teamId, membershipId);
    return HandlerApiResponse.success(bookmark);
  } catch (error: unknown) {
    const error_code = (error as TypeError)
      .message as keyof typeof messages.bookmark.create.error;

    Sentry.captureMessage(
      `Failed to save bookmark. Cause: ${
        messages.bookmark.create.error[error_code] ??
        (error as TypeError).message
      } (${linkUrl})`
    );

    // eslint-disable-next-line no-console
    console.log(error);
    return HandlerApiError.internalServerError();
  }
});

export async function POST(request: NextRequest, ctx: TeamsRequestContext) {
  return router.run(request, ctx) as Promise<Response>;
}
