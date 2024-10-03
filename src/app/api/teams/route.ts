import db from '@/lib/db';
import { AuthApiRequest } from '@/lib/router';
import { HandlerApiError, HandlerApiResponse } from '@/utils/handlerResponse';
import { Team } from '@prisma/client';
import { NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { createRouter } from 'next-connect';
import { NextRequest } from 'next/server';
import urlSlug from 'url-slug';
import options from '../auth/[...nextauth]/options';

export type ApiTeamResponseSuccess = Team;

export const router = createRouter<AuthApiRequest, NextApiResponse>();

const RESTRICTED_TEAM_NAMES = [
  'create',
  'login',
  'logout',
  'signup',
  'teams',
  'tags',
];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(options);

    if (!session) return HandlerApiError.unauthorized();
    const { teamName } = await req.json();
    if (!teamName) return HandlerApiError.badRequest();

    if (
      RESTRICTED_TEAM_NAMES.includes(teamName) ||
      teamName.length === 0 ||
      teamName.length > 30 ||
      (teamName as string).trim().length === 0
    ) {
      return HandlerApiError.customError('Team name is not valid', 400);
    }

    const checkTeamSlug = await db.team.findMany({
      select: { id: true },
      where: {
        slug: urlSlug(teamName),
      },
    });

    if (checkTeamSlug.length > 0) {
      return HandlerApiError.customError('Team name already taken', 400);
    }

    const team = await db.team.create({
      data: {
        name: teamName,
        slug: urlSlug(teamName),
      },
    });

    await db.user.update({
      data: {
        defaultTeamId: team.id,
      },
      where: {
        id: session.user.id,
      },
    });

    await db.membership.create({
      data: {
        team: {
          connect: {
            id: team.id,
          },
        },
        role: 'ADMIN',
        invitedEmail: session.user!.email!,
        user: {
          connect: {
            email: session.user!.email!,
          },
        },
      },
    });

    return HandlerApiResponse.created(team);
  } catch (error) {
    return HandlerApiError.internalServerError();
  }
}
