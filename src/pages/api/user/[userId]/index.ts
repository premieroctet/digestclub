import db from '@/lib/db';
import { checkAuth } from '@/lib/middleware';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router
  .use(checkAuth)
  .put(async (req, res) => {
    const userId = req.query.userId as string;

    if (req.user!.id !== userId) {
      return res.status(403).end();
    }

    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: req.body,
    });

    return res.status(200).json(updatedUser);
  })
  .delete(async (req, res) => {
    const userId = req.query.userId as string;

    if (req.user!.id !== userId) {
      return res.status(403).end();
    }

    const account = await db.user.delete({
      where: {
        id: userId,
      },
    });

    await db.team.deleteMany({
      where: {
        memberships: {
          none: {},
        },
      },
    });

    return res.status(201).json(account);
  });

export default router.handler({
  onError: errorHandler,
});
