'use server';

import db from '@/lib/db';

export const getTagBySlug = async (slug: string) => {
  const tag = await db.tag.findFirst({
    where: {
      slug: slug,
    },
  });
  return tag;
};

type PopularTag = {
  name: string;
  slug: string;
  id: string;
  description: string;
  block_count: number;
};

/**
 * Retrieves the 5 most popular tags associated with a DigestBlock (that is published).
 * These tags are based on the count of digest blocks associated with each tag.
 */
export const getPopularTags = async () => {
  try {
    const tagsByCount = await db.$queryRaw<PopularTag[]>`
      SELECT 
          tags.name,
          tags.slug,
          tags.id,
          tags.description,
          CAST(COUNT(digest_blocks.id) AS INTEGER) AS block_count 
      FROM 
          digest_blocks
      LEFT JOIN 
          _digestblocks_to_tags ON digest_blocks.id = _digestblocks_to_tags."A"
      LEFT JOIN 
          tags ON _digestblocks_to_tags."B" = tags.id 
      LEFT JOIN 
          digests ON digest_blocks."digestId" = digests.id
      WHERE 
          digests."publishedAt" IS NOT NULL
          AND _digestblocks_to_tags."B" IS NOT NULL
      GROUP BY 
          tags.name, tags.slug, tags.id, tags.description
      ORDER BY 
          block_count DESC
      LIMIT 5;
    `;

    return tagsByCount;
  } catch (error) {
    //eslint-disable-next-line no-console
    console.error(error);

    throw new Error('Error getting popular tags');
  }
};


export const getAllTags = async () => {
  try {
    const tags = await db.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return tags;
  } catch (error) {
    throw new Error('Error getting all tags');
  }
};