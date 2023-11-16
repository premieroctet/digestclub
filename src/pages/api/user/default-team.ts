import db from '@/lib/db';
import { checkTeam } from '@/lib/middleware';
import { AuthApiRequest } from '@/lib/router';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router
  .get(async (req, res) => {
    const sessionToken = req.query.sessionToken as string;
    let defaultTeamSlug = null;

    if (sessionToken) {
      const userSession = await db.session.findUnique({
        select: {
          user: { select: { defaultTeam: { select: { slug: true } } } },
        },
        where: { sessionToken },
      });

      defaultTeamSlug = userSession?.user?.defaultTeam?.slug;
    }

    return res.status(200).json({ defaultTeamSlug });
  })
  .patch(checkTeam, async (req, res) => {
    const teamId = req.teamId;
    const user = req.user;
    if (!teamId || !user) return res.status(403).end();

    await db.user.update({
      where: { id: user.id },
      data: { defaultTeamId: teamId },
    });
    return res.status(200).end();
  });

export default router.handler();
