import { UserRoles } from '@/core/constants';
import useCustomToast from '@/hooks/useCustomToast';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import api from '@/lib/api';
import { Member } from '@/lib/queries';
import { ApiDeleteMemberResponse } from '@/pages/api/teams/[teamId]/members/[memberId]';
import { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import TabsListItem from '../TabsListItem';

interface Props {
  membership: Member;
  canDelete: boolean;
}

const Item = ({ membership, canDelete }: Props) => {
  const { refresh } = useTransitionRefresh();
  const { successToast, errorToast } = useCustomToast();

  const { mutate: deleteMember, isLoading: isDeleting } = useMutation<
    AxiosResponse<ApiDeleteMemberResponse>,
    AxiosError<ErrorResponse>,
    { teamId: string; membershipId: string }
  >(
    'delete-member',
    ({ teamId, membershipId }) => {
      return api.delete(`/teams/${teamId}/members/${membershipId}`);
    },
    {
      onSuccess: () => {
        successToast('Member removed successfully');
        refresh();
      },
      onError: (error) => {
        if (error.message) errorToast(error.message);
        else errorToast('An error occurred');
      },
    }
  );

  const onDeleteClick = () => {
    if (!membership.user?.id) return;
    deleteMember({
      teamId: membership.teamId,
      membershipId: membership.id,
    });
  };

  return (
    <TabsListItem
      key={membership.user?.id}
      name={membership.user?.name || membership.user?.email || 'Anonymous'}
      deleteItem={canDelete ? onDeleteClick : undefined}
      isLoading={isDeleting}
      badge={{
        status: membership.role,
        type: membership.role === UserRoles.ADMIN ? 'admin' : 'default',
      }}
    />
  );
};

export default Item;
