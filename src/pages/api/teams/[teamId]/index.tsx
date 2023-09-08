import db from '@/lib/db';
import { checkTeam } from '@/lib/middleware';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router
  .use(checkTeam)
  .delete(async (req, res) => {
    const team = await db.team.delete({ where: { id: req.teamId } });

    return res.status(201).json({ team });
  })
  .patch(async (req, res) => {
    const { name, website, twitter, github, bio } = req.body;

    const team = await db.team.update({
      where: { id: req.teamId },
      data: {
        ...(name && { name }),
        ...(bio && { bio: bio.substring(0, 160) }),
        ...(website && { website }),
        ...(twitter && { twitter }),
        ...(github && { github }),
      },
    });

    return res.status(200).json({ team });
  });

export default router.handler({
  onError: errorHandler,
});
