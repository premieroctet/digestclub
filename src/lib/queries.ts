'use server';

import {
  BookmarkDigestStyle,
  Digest,
  DigestBlock,
  DigestBlockType,
  Prisma,
} from '@prisma/client';
import { unstable_cache } from 'next/cache';
import db from './db';
import { reorderList } from '@/utils/actionOnList';
import urlSlug from 'url-slug';

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

export type TeamLinksData = Awaited<ReturnType<typeof getTeamLinks>>;

export type TeamLinks = TeamLinksData['teamLinks'];

export type TeamBookmarkedLinkItem = TeamLinks[number];

export const getTeamDigests = async (
  teamId: string,
  page?: number,
  perPage = 30,
  isTemplate = false
) => {
  const digestsCount = await db.digest.count({
    where: {
      teamId,
    },
  });
  const digests = await db.digest.findMany({
    take: perPage,
    skip: page ? (page - 1) * perPage : 0,
    where: {
      teamId,
      isTemplate,
    },
    include: {
      digestBlocks: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return { digests, digestsCount };
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

export const getPublicDigest = (
  digestSlug: string,
  teamSlug: string,
  isPreview?: boolean
) =>
  db.digest.findFirst({
    select: {
      id: true,
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
          color: true,
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
  });

export const getDiscoverDigests = async ({
  page,
  perPage = 10,
  teamId,
}: {
  page?: number;
  perPage?: number;
  teamId?: string;
}) => {
  const where = {
    publishedAt: { not: null },
    digestBlocks: { some: { bookmarkId: { not: null } } },
    ...(teamId ? { teamId } : {}),
  };

  const digestsCount = await db.digest.count({
    where,
  });

  const digests = await db.digest.findMany({
    take: perPage,
    skip: page ? (page - 1) * perPage : 0,
    orderBy: { publishedAt: 'desc' },
    where,
    select: {
      id: true,
      publishedAt: true,
      title: true,
      description: true,
      slug: true,
      team: {
        select: {
          name: true,
          slug: true,
          color: true,
        },
      },
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
        where: {
          type: DigestBlockType?.BOOKMARK,
        },
      },
    },
  });

  return { digestsCount, digests, perPage };
};
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

export const incrementDigestView = async (digestId: string) => {
  return db.digest.update({
    where: {
      id: digestId,
    },
    data: {
      views: {
        increment: 1,
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
>['digests'][number];

export type PublicTeamResult = Awaited<ReturnType<typeof getPublicTeam>>;

export type PublicDigestResult = Awaited<ReturnType<typeof getPublicDigest>>;

export type DigestDataForTypefullyResult = Awaited<
  ReturnType<typeof getDigestDataForTypefully>
>;

export type DiscoveryDigest = Awaited<
  ReturnType<typeof getDiscoverDigests>
>['digests'][number];

export type CreateBlockData = {
  bookmarkId?: string;
  text?: string;
  position?: number;
  type: DigestBlockType;
  style?: BookmarkDigestStyle;
  isTemplate?: boolean;
};
/**
 * Create a new digest with the blocks from a template
 */
export async function createDigest({
  title,
  teamId,
}: {
  title: string;
  teamId: string;
}) {
  const newDigest = (await db.digest.create({
    data: {
      teamId,
      title: title,
      slug: urlSlug(title),
      isTemplate: false,
    },
    include: {
      digestBlocks: true,
    },
  })) as Digest & {
    digestBlocks: DigestBlock[];
  };

  return newDigest;
}

/**
 * Create a new digest with the blocks from a template
 */
export async function createDigestWithTemplate({
  title,
  templateId,
  teamId,
}: {
  title: string;
  templateId: string;
  teamId: string;
}) {
  // Get template
  const template = await db.digest.findUnique({
    where: {
      id: templateId,
    },
    include: {
      digestBlocks: true,
    },
  });

  // Create new digest
  const newDigest = await createDigest({ title, teamId });

  // Create all blocks from template
  const templateBlocks = template?.digestBlocks;
  if (!templateBlocks) {
    throw new Error('Template blocks not found');
  }

  await Promise.all(
    templateBlocks.map(async (block) => {
      const { bookmarkId, text, style, type, order } = block;
      return createDigestBlock(
        {
          type: type,
          ...(text && { text: text }),
          ...(style && { style: style }),
          ...(bookmarkId && { bookmarkId: bookmarkId }),
          isTemplate: false,
        },
        newDigest,
        order // we want to keep the same order as the template
      );
    })
  );

  return newDigest;
}

export const orderBlock = async (
  digestId: string,
  blockId: string,
  position: number
) => {
  const digestBlocks = await db.digestBlock.findMany({
    where: {
      digestId: digestId,
    },
    orderBy: {
      order: 'asc',
    },
  });

  if (digestBlocks) {
    const bookmarkDigestMoved = digestBlocks.find(
      (bookmarkDigest) => bookmarkDigest.id === blockId
    );

    if (bookmarkDigestMoved) {
      await db.$transaction(
        reorderList(digestBlocks, bookmarkDigestMoved.order, position).map(
          (currentBookmarkDigest: any, index: number) => {
            return db.digestBlock.updateMany({
              where: {
                id: currentBookmarkDigest.id,
                digestId: digestId,
              },
              data: { order: index },
            });
          }
        )
      );
    }
  }
};

/**
 * Create a digest block in a digest. If position is provided, the block will be ordered to that position depending on the other blocks in the digest.
 * If order is provided, the block will be ordered to that position regardless of the other blocks in the digest.
 * @param blockInfo The data to create the block with
 * @param digest The digest to create the block in
 * @param order Optional | The order to place the block in
 * @returns The created block
 */
export const createDigestBlock = async (
  blockInfo: CreateBlockData,
  digest: Digest & {
    digestBlocks: DigestBlock[];
  },
  order?: number | undefined
) => {
  const { bookmarkId, text, style, type, position, isTemplate } = blockInfo;
  const hasOrderParam = order !== undefined;
  const block = await db.digestBlock.create({
    data: {
      digestId: digest.id,
      ...(bookmarkId && { bookmarkId }),
      ...(text && { text }),
      ...(style && { style }),
      order: hasOrderParam ? order : digest.digestBlocks.length,
      type,
      isTemplate,
    },
  });

  if (position !== undefined && !hasOrderParam) {
    await orderBlock(digest.id, block.id, position);
  }
  return block;
};
