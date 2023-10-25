import client, { isUniqueConstraintError } from '@/lib/db';
import { checkDigest, checkTeam } from '@/lib/middleware';
import { Digest } from '@prisma/client';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import urlSlug from 'url-slug';
import { openAiCompletion } from '@/utils/openai';

export type ApiDigestResponseSuccess = Digest;

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router
  .use(checkTeam)
  .use(checkDigest)
  .patch(async (req, res) => {
    const digestId = req.query.digestId as string;

    try {
      let digest = await client.digest.findUnique({
        select: { publishedAt: true, teamId: true },
        where: { id: digestId?.toString() },
      });
      if (req.body.title !== undefined && !req.body.title.trim()) {
        /* Ensure title is not empty */
        return res.status(400).json({
          error: 'Title cannot be empty',
        });
      }
      const isFirstPublication = !digest?.publishedAt && !!req.body.publishedAt;

      if (isFirstPublication && process.env.OPENAI_API_KEY) {
        const lastDigests = await client.digest.findMany({
          select: { title: true },
          where: { teamId: digest?.teamId },
        });

        const lastDigestTitles = [
          ...lastDigests?.map((digest) => digest?.title),
          req.body.title,
        ].filter((title) => !!title);

        if (Boolean(lastDigestTitles?.length)) {
          const prompt = `
        Here is a list of document titles sorted from most recent to oldest, separared by ; signs : ${lastDigestTitles.join(
          ';'
        )} 
        Just guess the next document title. Don't add any other sentence in your response.
        `;

          try {
            const response = await openAiCompletion({ prompt });
            const guessedTitle = response[0]?.message?.content;

            await client.team.update({
              where: { id: digest?.teamId },
              data: {
                nextSuggestedDigestTitle: guessedTitle,
              },
            });
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
          }
        }
      }

      digest = await client.digest.update({
        where: {
          id: digestId?.toString(),
        },
        data: {
          ...req.body,
          // Do not update slug if digest has been published
          ...(req.body.title &&
            !digest?.publishedAt && {
              slug: urlSlug(req.body.title),
            }),
        },
      });

      return res.status(201).json(digest);
    } catch (e) {
      return res.status(400).json(
        isUniqueConstraintError(e) && {
          error: 'This digest name already exists',
        }
      );
    }
  })
  .delete(async (req, res) => {
    const digestId = req.query.digestId;

    const digest = await client.digest.delete({
      where: {
        id: digestId?.toString(),
      },
    });

    return res.status(201).json(digest);
  });

export default router.handler({
  onError: errorHandler,
});
