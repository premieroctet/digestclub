import Invitation from '@/components/pages/Invitation';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/sessions';
import { notFound } from 'next/navigation';

interface InvitationPageProps {
  params: { invitationId: string };
}

export const metadata = {
  title: 'Invitation',
};

const InvitationPage = async ({ params }: InvitationPageProps) => {
  const { invitationId } = params;
  const user = await getCurrentUser();

  const invitation = await db.invitation.findUnique({
    select: {
      id: true,
      membershipId: true,
      membership: {
        include: {
          team: true,
        },
      },
    },
    where: {
      id: invitationId!.toString(),
    },
  });

  if (!invitation) {
    return notFound();
  }

  return (
    <Invitation
      user={user}
      invitedEmail={invitation.membership.invitedEmail!}
      invitationId={invitation.id}
      team={invitation?.membership.team}
    />
  );
};

export default InvitationPage;
