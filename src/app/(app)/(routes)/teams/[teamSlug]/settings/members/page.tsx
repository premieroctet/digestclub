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
import TeamIntegrations from '@/components/teams/form/settings/TeamIntegrations';
import TeamUsers from '@/components/teams/form/settings/TeamUsers';

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
  return (
    <TeamUsers
      members={members}
      invitations={invitations}
      teamId={team.id.toString()}
      user={user}
      subscriptions={subscriptions}
    />
  );
}
