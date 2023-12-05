'use server';

import db from '@/lib/db';

export const getTeamMembershipById = (teamId: string, userId: string) =>
  db.membership.findFirst({
    select: { id: true, teamId: true },
    where: {
      userId,
      teamId,
    },
  });

export const getTeamMembers = (slug: string) =>
  db.membership.findMany({
    where: {
      team: {
        slug,
      },
      user: { NOT: { id: undefined } },
    },
    include: {
      user: {
        select: {
          email: true,
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

export type Member = Awaited<ReturnType<typeof getTeamMembers>>[number];
