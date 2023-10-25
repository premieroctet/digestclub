'use client';

import useCustomToast from '@/hooks/useCustomToast';
//@ts-expect-error
import { experimental_useOptimistic as useOptimistic } from 'react';
import { useTransition } from 'react';
import { TeamInvitation } from '@/lib/queries';
import message from '@/messages/en';
import InvitationItem from './InvitationItem';
import deleteInvitation from '@/actions/delete-invitation';
import { Invitation } from '@prisma/client';
import NoContent from '@/components/layout/NoContent';
import { UserIcon } from '@heroicons/react/24/solid';

type Props = {
  invitations: TeamInvitation[];
};

const InvitationList = ({ invitations }: Props) => {
  const { successToast, errorToast } = useCustomToast();
  const [isPending, startTransition] = useTransition();
  const [optiInvitations, removeOptiInvitation] = useOptimistic(
    invitations || [],
    (state: Invitation[], deleteId: string) =>
      [...state].filter((invitation) => invitation?.id !== deleteId)
  );

  const handleDeleteInvitation = async (invitation: TeamInvitation) => {
    startTransition(
      //@ts-expect-error
      async () => {
        removeOptiInvitation(invitation?.id);
        const { error } = await deleteInvitation(invitation.id);
        if (error) {
          errorToast(error.message);
          return;
        } else {
          successToast(message.invitation.delete.success);
        }
      }
    );
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
      {!invitations?.length && (
        <NoContent
          icon={<UserIcon className="h-10 w-10" />}
          title="No invitations"
          subtitle="There is no pending invitation for your team."
        />
      )}
    </div>
  );
};

export default InvitationList;
