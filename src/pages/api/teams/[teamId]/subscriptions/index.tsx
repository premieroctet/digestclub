import db from '@/lib/db';
import { checkAuth } from '@/lib/middleware';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router
  .post(async (req, res) => {
    try {
      const teamId = req.query.teamId as string;
      const email = req.body.email;
      const isAlreadySubscribed = await db.subscription.findFirst({
        where: {
          teamId,
          email,
        },
      });
      if (isAlreadySubscribed) {
        return res.status(200).json({
          email: email,
        });
      }

      await db.subscription.create({
        data: {
          email,
          team: {
            connect: {
              id: teamId,
            },
          },
        },
      });

      return res.status(200).json({
        email: email,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'Something went wrong',
      });
    }
  })
  .delete(async (req, res) => {
    const teamId = req.query.teamId as string;
    const email = req.body.email;
    const deletedSubscriptions = await db.subscription.deleteMany({
      where: {
        teamId,
        email,
      },
    });
    if (deletedSubscriptions.count > 0)
      return res.status(200).json({
        deletedSubscriptions,
      });
    else
      return res.status(404).json({
        error: 'Subscription not found',
      });
  });

router.use(checkAuth).get(async (req, res) => {
  const teamId = req.query.teamId as string;

  const subscriptions = await db.subscription.findMany({
    where: {
      teamId,
    },
  });

  return res.status(200).json({
    subscriptions,
  });
});

export default router.handler({
  onError: errorHandler,
});
