import db from '@/lib/db';
import { AuthApiRequest } from '@/lib/router';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const sessionToken = req.query.sessionToken as string;
  const teamSlug = req.query.teamSlug as string;
  if (!teamSlug || !sessionToken) return res.status(403).end();

  const userSession = await db.session.findUnique({
    select: {
      user: { select: { memberships: { select: { team: true } } } },
    },
    where: {
      sessionToken,
    },
  });
  const user = userSession?.user;
  const team = user?.memberships.find(
    (membership) => membership.team.slug === teamSlug
  )?.team;

  if (!team) return res.status(403).end();

  return res.status(200).json({ defaultTeamSlug: team.slug });
});

export default router.handler();
