'use client';

import Button from '../Button';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import { useMutation } from 'react-query';
import api from '@/lib/api';
import { routes } from '@/core/constants';
import { UserInvitationItem } from '@/lib/queries';
import useCustomToast from '@/hooks/useCustomToast';
import { useRouter } from 'next/navigation';

const UserInvitationItem = ({
  invitation,
}: {
  invitation: UserInvitationItem;
}) => {
  const router = useRouter();
  const { successToast, errorToast } = useCustomToast();
  const { refresh, isRefreshing } = useTransitionRefresh();
  const { mutate: joinTeam, isLoading } = useMutation(
    'join-team',
    ({ teamId, invitationId }: { teamId: string; invitationId: string }) =>
      api.get(`${routes.TEAMS}/${teamId}/invitations/${invitationId}/accept`),
    {
      onSuccess: () => {
        successToast('Welcome to your new team !');
        refresh();
        router.push(`${routes.TEAMS}/${invitation?.membership?.team?.slug}`, {
          forceOptimisticNavigation: true,
        });
      },
      onError: () => {
        errorToast('Something went wrong...');
      },
    }
  );

  return (
    <div role="group" className="flex gap-2 p-2 rounded-md bg-gray-50">
      <div className="w-full flex gap-2">
        <div className="flex gap-2 justify-between items-center w-full">
          <p className="overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[14rem] text-gray-900 font-semibold text-sm">
            {invitation?.membership?.team?.name}
          </p>
          <div className="flex gap-2 justify-between self-end items-center">
            <Button
              variant="outline"
              isLoading={isLoading || isRefreshing}
              onClick={() =>
                joinTeam({
                  teamId: invitation?.membership?.team?.id,
                  invitationId: invitation?.id,
                })
              }
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInvitationItem;
