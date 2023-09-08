import db from '@/lib/db';
import { checkAuth } from '@/lib/middleware';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { UserRoles } from '@/core/constants';
import { Membership } from '@prisma/client';

export const router = createRouter<AuthApiRequest, NextApiResponse>();

export type ApiDeleteMemberResponse = {
  membership: Membership;
};

router.use(checkAuth).delete(async (req, res) => {
  const memberId = req.query.memberId as string;
  const user = req.user;
  const teamId = req.query.teamId as string;

  const team = await db.team.findUnique({
    where: {
      id: teamId,
    },
    include: {
      memberships: true,
    },
  });
  if (!team) return res.status(404).json({ error: 'Team not found' });

  const currentUserMembership = team.memberships.find(
    (m) => m.userId === user?.id
  );
  if (!currentUserMembership)
    return res.status(404).json({ error: 'Membership not found' });

  const isAdmin = currentUserMembership.role === UserRoles.ADMIN;
  if (!isAdmin) return res.send(403);

  const isDeletingSelf = currentUserMembership.id === memberId;
  if (isDeletingSelf) return res.send(403);

  const targetMembership = await db.membership.findUnique({
    where: {
      id: memberId,
    },
  });
  if (!targetMembership) return res.send(404);
  if (targetMembership.teamId !== teamId) return res.status(404);

  await db.membership.delete({
    where: {
      id: memberId,
    },
  });
  return res.status(200).json({
    membership: targetMembership,
  });
});

export default router.handler({
  onError: errorHandler,
});
