'use server';

import { FEATURE_FLAGS } from '@/core/constants';
import db from '@/lib/db';
import { openAiCompletion } from '@/utils/openai';
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

export const generateLinksTags = async (
  {
    title,
    description,
  }: {
    title: string;
    description: string;
  },
  allTags: {
    id: string;
    name: string;
  }[]
): Promise<
  {
    id: string;
    name: string;
  }[]
> => {
  if (FEATURE_FLAGS.hasAITagsGeneration === false) return [];

  const prompt = `
  You're about to save a new bookmark, in a plateform called Digest Club, that allows you to save and share bookmarks with your team. We aim to make easier technology watch and knowledge sharing (about IT and web development).
  Generate tags for this bookmark based on the title and description. You can't add more than 2 tags and you must use tags that I provided below (separated with a commas). If no tags seems relevant (it might often be the case), just write NONE.
  Only returns the response, not the prompt. If only one tag is needed just return one tag (it can be the case sometimes). If two tags are needed, return two tags but the first one must be the most relevant one.
  ---
  Bookmark title: ${title}
  Bookmark description: ${description}
  ---
  Tags: ${allTags.map((tag) => tag.name).join(', ')}
  ---
  `;

  const response = await openAiCompletion({ prompt });

  const data = response[0].message.content;
  if (data === 'NONE' || !data) return [];
  // If AI can't find any tags or if the response is empty, we return an empty array

  const AITags = data.split(', ');
  const tags = allTags.filter((tag) => AITags.includes(tag.name));
  // We make sure the tags returned by the AI are in the allTags array
  if (tags.length === 0) return [];

  return tags;
};

export type TeamLinksData = Awaited<ReturnType<typeof getTeamLinks>>;
export type TeamLinks = TeamLinksData['teamLinks'];
export type TeamBookmarkedLinkItem = TeamLinks[number];
