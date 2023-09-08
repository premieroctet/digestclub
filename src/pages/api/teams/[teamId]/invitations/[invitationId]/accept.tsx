import db from '@/lib/db';
import { checkAuth } from '@/lib/middleware';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router.use(checkAuth).get(async (req, res) => {
  const invitationId = req.query.invitationId as string;

  const invitation = await db.invitation.findUnique({
    where: {
      id: invitationId,
    },
    include: {
      membership: {
        include: {
          team: true,
        },
      },
    },
  });

  if (!invitation) {
    return res.status(400).json({ error: 'Invitation not found' });
  }

  // Set user id to membership
  const membership = await db.membership.updateMany({
    where: {
      invitedEmail: req.user!.email,
    },
    data: {
      userId: req.user!.id,
    },
  });

  // Delete invitation
  await db.invitation.delete({
    where: {
      id: invitationId,
    },
  });

  // Set default team for user
  await db.user.update({
    data: {
      defaultTeamId: invitation.membership.teamId,
    },
    where: {
      id: req.user?.id,
    },
  });

  return res.status(200).json({
    membership,
  });
});

export default router.handler({
  onError: errorHandler,
});
