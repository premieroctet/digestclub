'use client';

import useCustomToast from '@/hooks/useCustomToast';
import { useTransition } from 'react';
import { TeamInvitation } from '@/lib/queries';
import message from '@/messages/en';
import InvitationItem from './InvitationItem';
import deleteInvitation from '@/actions/delete-invitation';

type Props = {
  invitations: TeamInvitation[];
};

const InvitationList = ({ invitations }: Props) => {
  const { successToast, errorToast } = useCustomToast();
  const [isPending, startTransition] = useTransition();

  const handleDeleteInvitation = async (invitation: TeamInvitation) => {
    startTransition(async () => {
      const { error } = await deleteInvitation(invitation.id);
      if (error) {
        errorToast(error.message);
        return;
      } else {
        successToast(message.invitation.delete.success);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2 pt-4">
      {invitations.map((invitation: TeamInvitation) => (
        <InvitationItem
          key={invitation.id}
          invitation={invitation}
          deleteInvitation={handleDeleteInvitation}
          isLoading={isPending}
        />
      ))}
    </div>
  );
};

export default InvitationList;
