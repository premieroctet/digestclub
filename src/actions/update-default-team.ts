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

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { defaultTeam: true },
    });
    if (!user) throw new Error('User not found');
    if (user.defaultTeam?.id === teamId) return;

    await db.user.update({
      where: { id: userId },
      data: { defaultTeam: { connect: { id: teamId } } },
    });
  } catch (err: any) {}
}
