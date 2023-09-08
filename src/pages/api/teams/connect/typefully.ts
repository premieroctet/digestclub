import db from '@/lib/db';
import { checkTeam } from '@/lib/middleware';
import { AuthApiRequest } from '@/lib/router';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router
  .use(checkTeam)
  .post(async (req, res) => {
    const apiKey = req.body.apiKey as string;
    if (apiKey !== '') {
      const team = await db.team.update({
        where: { id: req.teamId },
        data: {
          typefullyToken: apiKey,
        },
      });

      return res.status(302).redirect(`/teams/${team.slug}/settings`);
    }

    return res.status(400).json({ error: true });
  })
  .delete(async (req, res) => {
    const team = await db.team.update({
      where: { id: req.teamId },
      data: {
        typefullyToken: null,
      },
    });

    return res.status(200).json({ team });
  });

export default router.handler({});
