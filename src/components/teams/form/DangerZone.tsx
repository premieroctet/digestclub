'use client';

import { useMutation } from 'react-query';
import { Team } from '@prisma/client';
import { Session } from 'next-auth';
import api from '@/lib/api';
import useCustomToast from '@/hooks/useCustomToast';
import { AxiosError } from 'axios';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import { useRouter } from 'next/navigation';
import { DeletePopover } from '@/components/Popover';
import Button from '@/components/Button';
import clsx from 'clsx';

type DangerZoneProps = {
  onDelete: () => void;
  isLoading: boolean;
  buttonText: string;
  fullWidth?: boolean;
};

const DangerZone = ({
  onDelete,
  isLoading,
  buttonText,
  fullWidth = true,
}: DangerZoneProps) => (
  <div
    className={clsx({
      'w-full': fullWidth,
    })}
  >
    <div className="flex flex-col rounded-md text-sm whitespace-nowrap">
      <DeletePopover
        isLoading={isLoading}
        handleDelete={onDelete}
        trigger={<Button variant="destructiveGhost">{buttonText}</Button>}
      />
    </div>
  </div>
);

export const DangerZoneTeam = ({ team }: { team: Team }) => {
  const { errorToast } = useCustomToast();
  const { refresh, isRefreshing } = useTransitionRefresh();

  const { mutate: deleteTeam, isLoading } = useMutation(
    `delete-team-${team.id}`,
    () => api.delete(`/teams/${team.id}`),
    {
      onSuccess: () => {
        refresh();
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        errorToast(
          error.response?.data?.error ||
            error.response?.statusText ||
            error.message
        );
      },
    }
  );

  return (
    <DangerZone
      fullWidth={false}
      onDelete={deleteTeam}
      isLoading={isLoading || isRefreshing}
      buttonText="Delete team"
    />
  );
};

export const DangerZoneAccount = ({ user }: { user: Session['user'] }) => {
  const { errorToast } = useCustomToast();
  const { isRefreshing } = useTransitionRefresh();
  const router = useRouter();

  const { mutate: deleteAccount, isLoading } = useMutation(
    `delete-account-${user.id}`,
    () => api.delete(`/user/${user.id}`),
    {
      onSuccess: () => {
        router.refresh();
        router.push('/');
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        errorToast(
          error.response?.data?.error ||
            error.response?.statusText ||
            error.message
        );
      },
    }
  );

  return (
    <DangerZone
      onDelete={deleteAccount}
      isLoading={isLoading || isRefreshing}
      buttonText="Delete account"
    />
  );
};
