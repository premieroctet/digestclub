'use server';

import db from '@/lib/db';
import { DigestBlockType } from '@prisma/client';
import { unstable_cache } from 'next/cache';

export const getUserTeams = (userId?: string) => {
  if (userId)
    return db.team.findMany({
      where: {
        memberships: {
          some: {
            user: {
              id: userId,
            },
          },
        },
      },
    });
  return [];
};

export const getTeamBySlug = (slug: string) =>
  db.team.findFirstOrThrow({
    where: {
      slug,
    },
    include: {
      memberships: {
        where: { NOT: { user: null } },
        include: { user: { select: { email: true } } },
      },
    },
  });

export const getTeamById = (id: string) =>
  db.team.findFirstOrThrow({
    where: {
      id,
    },
  });

// export const updateDefaultTeam = (userId: string, teamId: string) =>
//   db.user.update({
//     data: {
//       defaultTeamId: teamId,
//     },
//     where: {
//       id: userId,
//     },
//   });

export const getPublicTeam = unstable_cache((slug: string) =>
  db.team.findFirst({
    where: {
      slug,
    },
    select: {
      slug: true,
      name: true,
      bio: true,
      website: true,
      github: true,
      twitter: true,
      color: true,
      id: true,
      Digest: {
        select: {
          publishedAt: true,
          title: true,
          description: true,
          slug: true,
          digestBlocks: {
            select: {
              id: true,
              bookmark: {
                select: {
                  link: {
                    select: {
                      url: true,
                      image: true,
                      blurHash: true,
                      title: true,
                    },
                  },
                },
              },
            },
            where: { type: DigestBlockType.BOOKMARK },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        where: {
          publishedAt: {
            not: null,
          },
        },
      },
    },
  })
);

export const getRecentTeams = async () => {
  const digests = await db.digest.findMany({
    take: 5,
    select: { team: { select: { name: true, slug: true, color: true } } },
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: 'desc' },
    distinct: ['teamId'],
  });

  return digests.map((digest) => digest.team);
};

export type PublicTeamResult = Awaited<ReturnType<typeof getPublicTeam>>;
