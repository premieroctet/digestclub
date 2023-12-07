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

export const getPopularTags = async () => {
  try {
    const tagsByCount = await db.$queryRaw<
      {
        name: string;
        slug: string;
        id: string;
        description: string;
        block_count: number;
      }[]
    >`
      SELECT 
        t.name AS name,
        t.slug AS slug,
        t.id AS id,
        t.description AS description,
        CAST(COUNT(db.id) AS INTEGER) AS block_count 
      FROM 
        digest_blocks AS db
      LEFT JOIN 
        _digestblocks_to_tags AS dbtt ON db.id = dbtt."A"
      LEFT JOIN 
        tags AS t ON dbtt."B" = t.id 
      GROUP BY 
        t.name, t.slug, t.id, t.description
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
