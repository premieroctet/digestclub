import client from '@/lib/db';
import { checkAuth } from '@/lib/middleware';
import { Team } from '@prisma/client';
import urlSlug from 'url-slug';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { isStringEmpty } from '@/utils/string';

export type ApiTeamResponseSuccess = Team;

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router.use(checkAuth).post(async (req, res) => {
  const { teamName } = req.body;

  if (!teamName) {
    return res.status(403).end();
  }

  if (isStringEmpty(teamName)) {
    return res.status(400).json({
      error: 'Team name cannot be empty',
    });
  }

  const checkTeamSlug = await client.team.findMany({
    select: { id: true },
    where: {
      slug: urlSlug(teamName),
    },
  });

  if (checkTeamSlug.length > 0) {
    return res.status(400).json({
      error: 'Team name already taken',
    });
  }

  const team = await client.team.create({
    data: {
      name: teamName,
      slug: urlSlug(teamName),
    },
  });

  await client.user.update({
    data: {
      defaultTeamId: team.id,
    },
    where: {
      id: req.user?.id,
    },
  });

  await client.membership.create({
    data: {
      team: {
        connect: {
          id: team.id,
        },
      },
      role: 'ADMIN',
      invitedEmail: req.user!.email!,
      user: {
        connect: {
          email: req.user!.email!,
        },
      },
    },
  });

  return res.status(201).json(team);
});

export default router.handler({
  onError: errorHandler,
});
