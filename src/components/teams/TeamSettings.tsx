'use client';

import { routes } from '@/core/constants';
import { Member, TeamDigestsResult, TeamInvitation } from '@/lib/queries';
import { Subscription, Team } from '@prisma/client';
import PageContainer from '../layout/PageContainer';
import SectionContainer from '../layout/SectionContainer';
import Loader from '../Loader';
import { Breadcrumb } from './Breadcrumb';
import TeamInfo from './form/settings/TeamInfo';
import TeamUsers from './TeamUsers';
import { Session } from 'next-auth';
import TeamTemplates from './form/settings/TeamTemplates';
import TeamIntegrations from './form/settings/TeamIntegrations';
import TeamToolBar from './TeamToolBar';
import { useState } from 'react';
import clsx from 'clsx';

type Props = {
  team: Team;
  members: Member[];
  subscriptions: Subscription[];
  invitations: TeamInvitation[];
  user: Session['user'];
  templates: TeamDigestsResult[];
};

export const TeamSettings = ({
  team,
  members,
  invitations,
  user,
  subscriptions,
  templates,
}: Props) => {
  const [selectedMenu, setSelectedMenu] = useState('info');
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
      <div className="flex md:flex-row  flex-col gap-4 pb-4">
        <TeamToolBar
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
        <SectionContainer title={team.name} className="flex-1 w-full">
          <div className="max-w-xl">
            <div className={clsx(selectedMenu !== 'info' && 'hidden')}>
              <TeamInfo team={team} />
            </div>
            <div className={clsx(selectedMenu !== 'templates' && 'hidden')}>
              <TeamTemplates team={team} templates={templates} />
            </div>
            <div className={clsx(selectedMenu !== 'integrations' && 'hidden')}>
              <TeamIntegrations team={team} />
            </div>
            <div className={clsx(selectedMenu !== 'members' && 'hidden')}>
              <TeamUsers
                members={members}
                invitations={invitations}
                teamId={team.id.toString()}
                user={user}
                subscriptions={subscriptions}
              />
            </div>
          </div>
        </SectionContainer>
      </div>
    </PageContainer>
  );
};
