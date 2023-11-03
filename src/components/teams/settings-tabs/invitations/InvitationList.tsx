'use client';

import useCustomToast from '@/hooks/useCustomToast';
import { useTransition, useOptimistic } from 'react';
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
  const [optiInvitations, removeOptiInvitation] = useOptimistic(
    invitations || [],
    (state, deleteId: string) =>
      [...state].filter((invitation) => invitation?.id !== deleteId)
  );

  const handleDeleteInvitation = async (invitation: TeamInvitation) => {
    startTransition(async () => {
      removeOptiInvitation(invitation?.id);
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
      {optiInvitations.map((invitation: TeamInvitation) => (
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
