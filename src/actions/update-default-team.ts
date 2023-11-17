'use server';
import db from '@/lib/db';
import * as Sentry from '@sentry/nextjs';
import { checkAuthAction, checkTeamAction, getErrorMessage } from './utils';

export default async function updateDefaultTeam(
  userId: string,
  teamId: string
) {
  try {
    await checkAuthAction();
    await checkTeamAction(teamId);

    await db.user.update({
      where: { id: userId },
      data: { defaultTeam: { connect: { id: teamId } } },
    });
  } catch (err: any) {
    Sentry.captureException(err);
  }
}
