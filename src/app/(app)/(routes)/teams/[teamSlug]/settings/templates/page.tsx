import React from 'react';
import { TeamPageProps } from '../../page';
import { getCurrentUser } from '@/lib/sessions';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { redirect } from 'next/navigation';
import TeamTemplates from '@/components/teams/form/settings/TeamTemplates';
import SettingsPageLayout from '@/components/teams/form/settings/SettingsPageLayout';
import { routes } from '@/core/constants';
import { getTeamSettingsPageInfo } from '@/utils/page';
import { getTeamDigests } from '@/services/database/digest';
import { checkUserTeamBySlug } from '@/services/database/user';

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
  const { digests: templates } = await getTeamDigests(team.id, 1, 30, true);

  const pageInfo = getTeamSettingsPageInfo('templates', team.slug);
  const { title, subtitle, menuItems, routePath } = pageInfo;
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
      <TeamTemplates templates={templates} team={team} />
    </SettingsPageLayout>
  );
}
