'use client';

import { routes } from '@/core/constants';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import api from '@/lib/api';
import { Team } from '@prisma/client';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import Button from '../Button';
import SectionContainer from '../layout/SectionContainer';
import Link from '../Link';

const Invitation = ({
  team,
  invitedEmail,
  invitationId,
  user,
}: {
  team: Team;
  invitedEmail: string;
  invitationId: string;
  user?: Session['user'];
}) => {
  const router = useRouter();
  const { refresh, isRefreshing } = useTransitionRefresh();

  const { mutate: joinTeam, isLoading } = useMutation(
    'join-team',
    () =>
      api.get(`${routes.TEAMS}/${team.id}/invitations/${invitationId}/accept`),
    {
      onSuccess: () => {
        refresh();
        router.push(`${routes.TEAMS}/${team.slug}`, {
          forceOptimisticNavigation: true,
        });
      },
    }
  );

  const isLogged = Boolean(user);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <SectionContainer className="flex flex-col items-stretch justify-center min-w-[500px]">
        <div className="flex flex-col items-start justify-center mb-4">
          <h1 className="font-bold text-2xl">
            {isLogged ? `Join ${team.name} 🏄🏻‍♂️` : `Hello from ${team.name} 👋`}
          </h1>
        </div>
        <div className="mb-8">
          <p>
            Hello <b>{isLogged ? user?.email : invitedEmail}</b>
          </p>
          <p>
            {isLogged ? (
              <>
                Your are ready to join the <b>{team.name}</b> team!
              </>
            ) : (
              <>
                Your have been invited to join the <b>{team.name}</b> team.
              </>
            )}
          </p>
        </div>
        <div className="flex justify-end">
          {isLogged ? (
            <Button
              isLoading={isLoading || isRefreshing}
              onClick={() => joinTeam()}
            >
              Join
            </Button>
          ) : (
            <Link
              href={`${routes.LOGIN}?email=${encodeURIComponent(
                invitedEmail
              )}&callbackUrl=/invitations/${invitationId}/accept`}
            >
              Login to join
            </Link>
          )}
        </div>
      </SectionContainer>
    </div>
  );
};

export default Invitation;
