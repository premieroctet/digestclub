'use server';

import db from '@/lib/db';
import { DigestBlockType } from '@prisma/client';

export const checkDigestAuth = (teamId: string, digestId: string) =>
  db.digest.count({
    where: {
      teamId,
      id: digestId,
    },
  });

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

export type TeamDigestsResult = Awaited<
  ReturnType<typeof getTeamDigests>
>['digests'][number];

export type PublicDigestResult = Awaited<ReturnType<typeof getPublicDigest>>;

export type DigestDataForTypefullyResult = Awaited<
  ReturnType<typeof getDigestDataForTypefully>
>;

export type DiscoveryDigest = Awaited<
  ReturnType<typeof getDiscoverDigests>
>['digests'][number];
