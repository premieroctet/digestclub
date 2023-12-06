'use server';

import db from '@/lib/db';

export const getTagBySlug = async (slug: string) => {
  const tag = await db.tags.findFirstOrThrow({
    where: {
      slug: slug,
    },
  });
  return tag;
};
