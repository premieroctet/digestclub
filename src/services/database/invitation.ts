import db from '@/lib/db';

export const getUserInvitations = (email: string) =>
  db.invitation.findMany({
    select: {
      id: true,
      membership: {
        select: { team: { select: { name: true, id: true, slug: true } } },
      },
    },
    where: {
      membership: { invitedEmail: email },
      expiredAt: { gte: new Date() },
    },
  });

export const getTeamInvitations = (slug: string) =>
  db.invitation.findMany({
    where: {
      membership: {
        team: {
          slug,
        },
      },
      AND: {
        validatedAt: null,
      },
    },
    include: {
      membership: {
        select: {
          invitedEmail: true,
          invitedName: true,
          user: true,
          teamId: true,
        },
      },
    },
  });

export type TeamInvitation = Awaited<
  ReturnType<typeof getTeamInvitations>
>[number];

export type UserInvitationsResults = Awaited<
  ReturnType<typeof getUserInvitations>
>;

export type UserInvitationItem = UserInvitationsResults[number];
