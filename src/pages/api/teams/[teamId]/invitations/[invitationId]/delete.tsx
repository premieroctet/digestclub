import db from '@/lib/db';
import { checkAuth } from '@/lib/middleware';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router.use(checkAuth).delete(async (req, res) => {
  const invitationId = req.query.invitationId as string;
  const teamId = req.query.teamId as string;

  const userMembership = await db.membership.findFirst({
    where: {
      userId: req.user!.id,
      teamId: teamId,
    },
  });

  // Delete invitation
  const invitation = await db.invitation.delete({
    where: {
      id: invitationId,
    },
  });

  await db.membership.delete({
    where: {
      id: invitation.membershipId,
    },
  });

  return res.status(200).json(invitation);
});

export default router.handler({
  onError: errorHandler,
});
