import React from 'react';
import { TeamPageProps } from '../../page';
import { getCurrentUser } from '@/lib/sessions';
import { checkUserTeamBySlug } from '@/lib/queries';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { redirect } from 'next/navigation';
import TeamIntegrations from '@/components/teams/form/settings/TeamIntegrations';
import SettingsPageLayout from '@/components/teams/form/settings/SettingsPageLayout';
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
  const pageInfo = TEAM_SETTINGS_ITEMS.find(
    (item) => item.id === 'integrations'
  );
  if (!pageInfo) {
    throw new Error('Page not implemented (see core/constants.tsx)');
  }
  const { title, subtitle, routePath } = pageInfo;

  const menuItems = TEAM_SETTINGS_ITEMS.map((item) => ({
    ...item,
    href: item.routePath.replace(':slug', team.slug),
    isActive: item.id === 'integrations',
  }));

  return (
    <SettingsPageLayout
      title={title}
      subtitle={subtitle}
      menuItems={menuItems}
      breadcrumbItems={[
        {
          name: team.name,
          href: routes.TEAM.replace(':slug', team.slug),
        },
        {
          name: 'Settings',
        },
        {
          name: title,
          href: routePath.replace(':slug', team.slug),
        },
      ]}
    >
      <TeamIntegrations team={team} />
    </SettingsPageLayout>
  );
}
