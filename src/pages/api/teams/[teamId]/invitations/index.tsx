import { EMAIL_SUBJECTS, sendEmail } from '@/emails';
import InvitationEmail from '@/emails/templates/InvitationEmail';
import client from '@/lib/db';
import { checkAuth } from '@/lib/middleware';
import { getEnvHost } from '@/lib/server';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router.use(checkAuth).post(async (req, res) => {
  const teamId = req.query.teamId as string;
  const email = req.body.email;

  const memberships = await client.membership.findMany({
    where: {
      teamId,
      invitedEmail: email,
    },
    include: { invitations: true },
  });

  let membership = memberships?.[0];
  const now = new Date();

  // User already exist in team
  if (membership && membership.userId) {
    return res.status(400).json({
      error: 'User already belong to this team',
    });
  }

  if (membership && membership.invitations.some((i) => i.expiredAt > now)) {
    return res.status(400).json({
      error: 'User already invited to this team',
    });
  }

  if (!membership) {
    membership = await client.membership.create({
      data: {
        invitedEmail: email,
        role: 'USER',
        team: {
          connect: {
            id: teamId,
          },
        },
      },
      include: { invitations: true },
    });
  }

  const invitation = await client.invitation.create({
    select: {
      id: true,
      membership: { select: { team: { select: { name: true } } } },
    },
    data: {
      membership: {
        connect: {
          id: membership.id,
        },
      },
      expiredAt: new Date(now.setMonth(now.getMonth() + 1)),
    },
  });

  await sendEmail({
    subject: EMAIL_SUBJECTS.INVITATION,
    to: email,
    component: (
      <InvitationEmail
        teamName={invitation.membership.team.name}
        url={`${getEnvHost()}/invitations/${invitation.id}/accept`}
      />
    ),
  });

  return res.status(200).json({
    invitation,
  });
});

export default router.handler({
  onError: errorHandler,
});
