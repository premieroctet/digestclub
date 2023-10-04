'use server';
import db from '@/lib/db';
import * as Sentry from '@sentry/nextjs';
import { revalidateTag } from 'next/cache';
import { checkAuthAction, checkTeamAction, getErrorMessage } from './utils';
import { Team } from '@prisma/client';

interface UpdateTeamInfoResult {
  error?: {
    message: string;
  };
  data?: {
    team: string;
  };
}

export default async function updateTeamInfo(
  updatedTeamInfo: Partial<Team>,
  teamId: string
): Promise<UpdateTeamInfoResult> {
  try {
    await checkAuthAction();
    await checkTeamAction(teamId);

    const updatedTeam = await db.team.update({
      where: { id: teamId },
      data: updatedTeamInfo,
    });

    return {
      data: {
        team: JSON.stringify(updatedTeam),
      },
    };
  } catch (err: any) {
    Sentry.captureException(err);
    return {
      error: {
        message: getErrorMessage(err.message),
      },
    };
  }
}
