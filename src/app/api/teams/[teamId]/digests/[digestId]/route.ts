import client from '@/lib/db';
import { checkDigestAppRouter, checkTeamAppRouter } from '@/lib/middleware';
import { HandlerApiError, HandlerApiResponse } from '@/utils/handlerResponse';
import { openAiCompletion } from '@/utils/openai';
import { Digest } from '@prisma/client';
import { createEdgeRouter } from 'next-connect';
import { NextRequest } from 'next/server';
import urlSlug from 'url-slug';

export type ApiDigestResponseSuccess = Digest;

export interface TeamsDigestsRequestContext {
  params: {
    teamId: string;
    digestId: string;
  };

  // Not the best way to do this but it works for now
  // We need the middleware to set these values
  // Right now next-connect doesn't support generics to enrich the request (https://github.com/hoangvvo/next-connect/issues/230)
  membershipId: string;
  teamId: string;
  user: { id: string; email: string };
}

const router = createEdgeRouter<NextRequest, TeamsDigestsRequestContext>();

router
  .use(checkTeamAppRouter)
  .use(checkDigestAppRouter)
  .patch(async (req, event, next) => {
    const digestId = event.params.digestId as string;
    try {
      const body = await req.json();
      let digest = await client.digest.findUnique({
        select: { publishedAt: true, teamId: true },
        where: { id: digestId?.toString() },
      });
      if (body.title !== undefined && !body.title.trim()) {
        /* Ensure title is not empty */
        return HandlerApiError.customError('Title cannot be empty', 400);
      }
      const isFirstPublication = !digest?.publishedAt && !!body.publishedAt;
      if (isFirstPublication && process.env.OPENAI_API_KEY) {
        const lastDigests = await client.digest.findMany({
          select: { title: true },
          where: { teamId: digest?.teamId },
          take: 5,
          orderBy: { publishedAt: 'desc' },
        });
        if (!digest?.teamId) throw new Error('Missing teamId');

        const lastDigestTitles = [
          body.title,
          ...lastDigests?.map((digest) => digest?.title),
        ].filter((title) => !!title);

        updateSuggestedDigestTitle(lastDigestTitles.reverse(), digest?.teamId!);
      }

      digest = await client.digest.update({
        where: {
          id: digestId?.toString(),
        },
        data: {
          ...body,
          // Do not update slug if digest has been published
          ...(body.title &&
            !digest?.publishedAt && {
              slug: urlSlug(body.title),
            }),
        },
      });
      return HandlerApiResponse.success(digest);
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.log(error);
      return HandlerApiError.internalServerError();
    }
  })
  .delete(async (req, event, next) => {
    const digestId = event.params.digestId;
    try {
      const digest = await client.digest.delete({
        where: {
          id: digestId?.toString(),
        },
      });

      if (!digest) {
        return HandlerApiError.notFound();
      }

      const wasAPublishedDigest = Boolean(digest?.publishedAt);
      if (wasAPublishedDigest) {
        await client.team.update({
          where: { id: digest?.teamId },
          data: {
            nextSuggestedDigestTitle: null,
          },
        });
      }

      return HandlerApiResponse.success(digest);
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.log(error);
      return HandlerApiError.internalServerError();
    }
  });

async function updateSuggestedDigestTitle(
  lastDigestTitles: {
    title: string;
  }[],
  teamId: string
) {
  if (Boolean(lastDigestTitles?.length)) {
    const prompt = `
        Here is a list of document titles sorted from most recent to oldest, separared by ; signs : ${lastDigestTitles.join(
          ';'
        )} 
        Just guess the next document title. Don't add any other sentence in your response. If you can't guess a logical title, just write idk.
        `;

    try {
      const response = await openAiCompletion({ prompt });
      const guessedTitle = response[0]?.message?.content;
      const canPredict = guessedTitle !== 'idk';
      if (canPredict) {
        await client.team.update({
          where: { id: teamId },
          data: {
            nextSuggestedDigestTitle: guessedTitle,
          },
        });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: TeamsDigestsRequestContext
) {
  return router.run(request, ctx) as Promise<Response>;
}

export async function DELETE(
  request: NextRequest,
  ctx: TeamsDigestsRequestContext
) {
  return router.run(request, ctx) as Promise<Response>;
}
