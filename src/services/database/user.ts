import db from '@/lib/db';

export const getUserById = (userId: string) =>
  db.user.findUnique({
    where: {
      id: userId,
    },
  });

export const checkUserTeamBySlug = (slug: string, userId: string) =>
  db.team.findFirst({
    where: {
      slug,
      memberships: { some: { user: { id: userId } } },
    },
    include: {
      memberships: {
        where: { NOT: { user: null } },
        include: { user: { select: { email: true } } },
      },
    },
  });
