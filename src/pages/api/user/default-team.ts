import db from '@/lib/db';
import { AuthApiRequest } from '@/lib/router';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router.get(async (req, res) => {
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
});

export default router.handler();
