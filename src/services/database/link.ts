'use server';

import db from '@/lib/db';
import { Prisma } from '@prisma/client';

/**
 * Get bookmarks of a team in the team page, used to list the bookmarks in the team page
 */
export const getTeamLinks = async (
  teamId: string,
  options: {
    page?: number;
    perPage?: number;
    onlyNotInDigest?: boolean;
    search?: string;
  }
) => {
  const { page, perPage = 10 } = options;

  const searchWhere = {
    OR: [
      {
        title: {
          contains: options.search,
          mode: Prisma.QueryMode.insensitive,
        },
      },
      {
        description: {
          contains: options.search,
          mode: Prisma.QueryMode.insensitive,
        },
      },
      {
        url: {
          contains: options.search,
          mode: Prisma.QueryMode.insensitive,
        },
      },
    ],
  };

  const where = {
    AND: [
      options.search ? searchWhere : {},
      {
        bookmark: {
          some: {
            teamId,
          },
          ...(options.onlyNotInDigest && {
            every: {
              digestBlocks: { none: {} },
            },
          }),
        },
      },
    ],
  };

  const linksCount = await db.link.count({
    where,
  });

  const teamLinks = await db.link.findMany({
    take: perPage,
    skip: page ? (page - 1) * perPage : 0,
    orderBy: {
      createdAt: 'desc',
    },
    where,
    include: {
      bookmark: {
        select: {
          createdAt: true,
          updatedAt: true,
          id: true,
          teamId: true,
          provider: true,
          membership: {
            include: {
              user: {
                select: {
                  email: true,
                  name: true,
                },
              },
            },
          },
          digestBlocks: {
            select: {
              digest: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
        where: {
          teamId,
          ...(options.onlyNotInDigest && {
            digestBlocks: { none: {} },
          }),
        },
      },
    },
  });

  return {
    teamLinks,
    linksCount,
    perPage,
  };
};

/**
 * Returns the number links of a team, (all links, not only the ones in the team page)
 */
export const countAllTeamLinks = async (teamId: string) => {
  return db.link.count({
    where: {
      bookmark: {
        some: {
          teamId,
        },
      },
    },
  });
};

export const incrementLinkView = async (bookmarkId: string) => {
  return db.bookmark.update({
    where: {
      id: bookmarkId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });
};

export type TeamLinksData = Awaited<ReturnType<typeof getTeamLinks>>;
export type TeamLinks = TeamLinksData['teamLinks'];
export type TeamBookmarkedLinkItem = TeamLinks[number];
