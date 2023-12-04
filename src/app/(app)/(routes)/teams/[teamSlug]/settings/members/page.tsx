import React from 'react';
import { TeamPageProps } from '../../page';
import { getCurrentUser } from '@/lib/sessions';
import {
  checkUserTeamBySlug,
  getTeamInvitations,
  getTeamMembers,
  getTeamSubscriptions,
} from '@/lib/queries';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { redirect } from 'next/navigation';
import TeamUsers from '@/components/teams/form/settings/TeamUsers';
import TeamSettingsPageLayout from '@/components/teams/form/settings/SettingsPageLayout';
import { TEAM_SETTINGS_ITEMS, routes } from '@/core/constants';

export default async function Page({ params }: TeamPageProps) {
  const teamSlug = params.teamSlug;
  const user = await getCurrentUser();
  if (!user) {
    return redirect(authOptions.pages!.signIn!);
  }
  const team = await checkUserTeamBySlug(teamSlug, user.id);

  if (!team) {
    redirect('/teams');
  }
  const members = await getTeamMembers(teamSlug);
  const invitations = await getTeamInvitations(teamSlug);
  const subscriptions = await getTeamSubscriptions(teamSlug);

  const pageInfo = TEAM_SETTINGS_ITEMS.find((item) => item.id === 'members');
  if (!pageInfo) {
    throw new Error('Page not implemented (see core/constants.tsx)');
  }
  const { title, subtitle, routePath } = pageInfo;
  return (
    <TeamSettingsPageLayout
      team={team}
      title={title}
      subtitle={subtitle}
      breadcrumbCurrentItem={{
        name: title,
        href: routePath.replace(':slug', team.slug),
      }}
    >
      <TeamUsers
        members={members}
        invitations={invitations}
        teamId={team.id.toString()}
        user={user}
        subscriptions={subscriptions}
      />
    </TeamSettingsPageLayout>
  );
}
