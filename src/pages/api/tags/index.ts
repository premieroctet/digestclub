import db from '@/lib/db';
import { AuthApiRequest } from '@/lib/router';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  try {
    /** Get all available tags */
    const tags = await db.tag.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
      },
    });

    return res.status(200).json({ tags });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router.handler();
