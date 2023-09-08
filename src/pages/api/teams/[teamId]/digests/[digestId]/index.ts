import client, { isUniqueConstraintError } from '@/lib/db';
import { checkDigest, checkTeam } from '@/lib/middleware';
import { Digest } from '@prisma/client';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import urlSlug from 'url-slug';

export type ApiDigestResponseSuccess = Digest;

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router
  .use(checkTeam)
  .use(checkDigest)
  .patch(async (req, res) => {
    const digestId = req.query.digestId as string;

    try {
      let digest = await client.digest.findUnique({
        select: { publishedAt: true },
        where: { id: digestId?.toString() },
      });
      if (req.body.title !== undefined && !req.body.title.trim()) {
        /* Ensure title is not empty */
        return res.status(400).json({
          error: 'Title cannot be empty',
        });
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
