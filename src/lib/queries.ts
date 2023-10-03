import { cache } from 'react';
import db from './db';
import { Prisma } from '@prisma/client';
export const getUserById = (userId: string) =>
  db.user.findUnique({
    where: {
      id: userId,
    },
  });

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

export const getUserInvitations = (email: string) =>
  db.invitation.findMany({
    select: {
      id: true,
      membership: {
        select: { team: { select: { name: true, id: true, slug: true } } },
      },
    },
    where: {
      membership: { invitedEmail: email },
      expiredAt: { gte: new Date() },
    },
  });

export const checkUserTeamBySlug = cache((slug: string, userId: string) =>
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
  })
);

export const checkDigestAuth = (teamId: string, digestId: string) =>
  db.digest.count({
    where: {
      teamId,
      id: digestId,
    },
  });

export const getTeamMembershipById = (teamId: string, userId: string) =>
  db.membership.findFirst({
    select: { id: true, teamId: true },
    where: {
      userId,
      teamId,
    },
  });

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

export const updateDefaultTeam = (userId: string, teamId: string) =>
  db.user.update({
    data: {
      defaultTeamId: teamId,
    },
    where: {
      id: userId,
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

export const getTeamInvitations = (slug: string) =>
  db.invitation.findMany({
    where: {
      membership: {
        team: {
          slug,
        },
      },
      AND: {
        validatedAt: null,
      },
    },
    include: {
      membership: {
        select: {
          invitedEmail: true,
          invitedName: true,
          user: true,
          teamId: true,
        },
      },
    },
  });

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

  const totalCount = await db.link.count({
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
    totalCount,
    perPage,
  };
};

export type TeamLinksData = Awaited<ReturnType<typeof getTeamLinks>>;

export type TeamLinks = TeamLinksData['teamLinks'];

export type TeamBookmarkedLinkItem = TeamLinks[number];

export const getTeamDigests = async (
  teamId: string,
  page?: number,
  perPage = 30
) => {
  const digests = await db.digest.findMany({
    take: perPage,
    skip: page ? (page - 1) * perPage : 0,
    where: {
      teamId,
    },
    include: {
      digestBlocks: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return digests;
};

export const getDigest = async (id: string) => {
  const digest = await db.digest.findUnique({
    where: {
      id,
    },
    include: {
      digestBlocks: {
        orderBy: { order: 'asc' },
        include: {
          bookmark: {
            include: {
              link: {
                select: {
                  url: true,
                  description: true,
                  image: true,
                  title: true,
                  blurHash: true,
                },
              },
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
            },
          },
        },
      },
    },
  });

  return digest;
};

export const getPublicTeam = cache((slug: string) =>
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
      id: true,
      Digest: {
        select: {
          publishedAt: true,
          title: true,
          description: true,
          slug: true,
          _count: {
            select: {
              digestBlocks: true,
            },
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

export const getPublicDigest = cache(
  (digestSlug: string, teamSlug: string, isPreview?: boolean) =>
    db.digest.findFirst({
      select: {
        publishedAt: true,
        title: true,
        description: true,
        team: {
          select: {
            id: true,
            slug: true,
            name: true,
            bio: true,
            website: true,
            github: true,
            twitter: true,
          },
        },
        digestBlocks: {
          select: {
            id: true,
            order: true,
            title: true,
            style: true,
            bookmarkId: true,
            description: true,
            text: true,
            type: true,
            bookmark: {
              include: {
                link: {
                  select: {
                    url: true,
                    description: true,
                    image: true,
                    title: true,
                    blurHash: true,
                  },
                },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      where: {
        slug: digestSlug,
        team: { slug: teamSlug },
        ...(!isPreview ? { publishedAt: { lte: new Date() } } : {}),
      },
    })
);

export const getDigestDataForTypefully = async (
  digestId: string,
  teamId: string
) =>
  db.digest.findFirst({
    select: {
      publishedAt: true,
      title: true,
      description: true,
      typefullyThreadUrl: true,
      teamId: true,
      slug: true,
      team: {
        select: {
          slug: true,
        },
      },
      digestBlocks: {
        select: {
          order: true,
          title: true,
          style: true,
          bookmarkId: true,
          description: true,
          text: true,
          type: true,
          bookmark: {
            include: {
              link: {
                select: {
                  url: true,
                  description: true,
                  title: true,
                },
              },
            },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
    where: {
      id: digestId,
      team: { id: teamId },
    },
  });

export const getTeamSubscriptions = async (teamSlug: string) => {
  const subscriptions = await db.subscription.findMany({
    where: {
      team: {
        slug: teamSlug,
      },
    },
  });
  return subscriptions;
};

export type Member = Awaited<ReturnType<typeof getTeamMembers>>[number];

export type TeamInvitation = Awaited<
  ReturnType<typeof getTeamInvitations>
>[number];

export type UserInvitationsResults = Awaited<
  ReturnType<typeof getUserInvitations>
>;

export type UserInvitationItem = UserInvitationsResults[number];

export type TeamDigestsResult = Awaited<
  ReturnType<typeof getTeamDigests>
>[number];

export type PublicTeamResult = Awaited<ReturnType<typeof getPublicTeam>>;

export type PublicDigestResult = Awaited<ReturnType<typeof getPublicDigest>>;

export type DigestDataForTypefullyResult = Awaited<
  ReturnType<typeof getDigestDataForTypefully>
>;
