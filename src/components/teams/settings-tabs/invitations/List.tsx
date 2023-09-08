import useCustomToast from '@/hooks/useCustomToast';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import api from '@/lib/api';
import { TeamInvitation } from '@/lib/queries';
import message from '@/messages/en';
import { useMutation } from 'react-query';
import Item from './Item';

type Props = {
  invitations: TeamInvitation[];
};

const List = ({ invitations }: Props) => {
  const { successToast, errorToast } = useCustomToast();
  const { refresh, isRefreshing } = useTransitionRefresh();

  const { mutate: deleteInvitation, isLoading } = useMutation(
    'detele-invitation',
    (invitation: TeamInvitation) =>
      api.delete(
        `/teams/${invitation.membership.teamId}/invitations/${invitation.id}/delete`
      ),
    {
      onSuccess: () => {
        successToast(message.invitation.delete.success);
        refresh();
      },
      onError: () => {
        errorToast(message.invitation.delete.error);
      },
    }
  );

  return (
    <div className="flex flex-col gap-2 pt-4">
      {invitations.length === 0 ? (
        <div className="flex items-center justify-start">
          <p className="mt-1 text-base text-gray-500">
            You have no pending invitations.
          </p>
        </div>
      ) : (
        <>
          {invitations.map((invitation) => (
            <Item
              key={invitation.id}
              invitation={invitation}
              deleteInvitation={deleteInvitation}
              isLoading={isLoading || isRefreshing}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default List;
