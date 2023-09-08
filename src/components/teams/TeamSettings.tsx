'use client';

import { routes } from '@/core/constants';
import { Member, TeamInvitation } from '@/lib/queries';
import { Subscription, Team } from '@prisma/client';
import PageContainer from '../layout/PageContainer';
import SectionContainer from '../layout/SectionContainer';
import Loader from '../Loader';
import { Breadcrumb } from './Breadcrumb';
import SettingsForm from './form/settings/SettingsForm';
import TeamSettingsMembers from './TeamSettingsMembers';
import { Session } from 'next-auth';

type Props = {
  team: Team;
  members: Member[];
  subscriptions: Subscription[];
  invitations: TeamInvitation[];
  user: Session['user'];
};

export const TeamSettings = ({
  team,
  members,
  invitations,
  user,
  subscriptions,
}: Props) => {
  if (!team || !members || !subscriptions) return <Loader fullPage />;

  return (
    <PageContainer
      breadCrumb={
        <Breadcrumb
          paths={[
            {
              name: team.name,
              href: routes.TEAM.replace(':slug', team.slug),
            },
            {
              name: 'Settings',
              href: routes.TEAMS_EDIT.replace(':slug', team.slug),
            },
          ]}
        />
      }
    >
      <SectionContainer title={team.name}>
        <div className="flex flex-col md:flex-row gap-10 ">
          <div className="rounded-lg w-full md:w-1/2 lg:w-[55%]">
            <SettingsForm team={team} />
          </div>
          <div className="w-full md:w-1/2 lg:w-[45%]">
            <TeamSettingsMembers
              members={members}
              invitations={invitations}
              teamId={team.id.toString()}
              user={user}
              subscriptions={subscriptions}
            />
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
};
