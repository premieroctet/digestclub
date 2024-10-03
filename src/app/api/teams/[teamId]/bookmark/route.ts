import options from '@/app/api/auth/[...nextauth]/options';
import messages from '@/messages/en';
import { saveBookmark } from '@/services/database/bookmark';
import { getTeamMembershipById } from '@/services/database/membership';
import { HandlerApiError, HandlerApiResponse } from '@/utils/handlerResponse';
import { Bookmark } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';
import { getServerSession } from 'next-auth';
import { createEdgeRouter } from 'next-connect';
import type { NextRequest } from 'next/server';

export type ApiBookmarkResponseSuccess = Bookmark;

interface RequestContext {
  params: {
    teamId: string;
  };
}

const router = createEdgeRouter<NextRequest, RequestContext>();

router
  .use(async (req, event, next) => {
    const session = await getServerSession(options);
    // req.query.state is for Slack integration (we cant choose the name of the query param)
    // @todo implement slack integration with teamId (req.query.state)
    const teamId = event.params.teamId as string;

    if (!session && !teamId) {
      return HandlerApiError.unauthorized();
    }

    const membership = await getTeamMembershipById(teamId, session!.user?.id);

    if (!membership) {
      return HandlerApiError.unauthorized();
    }

    return next();
  })
  .get(async (req, event, next) => {
    const body = await req.json();
    const linkUrl = body.link as string;
    try {
      const session = await getServerSession(options);
      const { teamId } = event.params;
      if (!session || !teamId) return HandlerApiError.unauthorized();
      const membership = await getTeamMembershipById(teamId, session?.user?.id);

      if (!linkUrl) {
        return HandlerApiError.badRequest();
      }

      const bookmark = await saveBookmark(linkUrl, teamId, membership?.id);
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

export async function GET(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
