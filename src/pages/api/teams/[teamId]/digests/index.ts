import client, { isUniqueConstraintError } from '@/lib/db';
import { checkTeam } from '@/lib/middleware';
import { Digest } from '@prisma/client';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import urlSlug from 'url-slug';

export type ApiDigestResponseSuccess = Digest;

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router.use(checkTeam).post(async (req, res) => {
  try {
    const digest = await client.digest.create({
      data: {
        teamId: req.teamId!,
        title: req.body.title,
        slug: urlSlug(req.body.title),
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
});

export default router.handler({
  onError: errorHandler,
});
