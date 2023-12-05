import TeamInfo from '@/components/teams/form/settings/TeamInfo';
import React from 'react';
import { TeamPageProps } from '../../page';
import { getCurrentUser } from '@/lib/sessions';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { redirect } from 'next/navigation';
import SettingsPageLayout from '@/components/teams/form/settings/SettingsPageLayout';
import { routes } from '@/core/constants';
import { getTeamSettingsPageInfo } from '@/utils/page';
import Link from 'next/link';
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

  const pageInfo = getTeamSettingsPageInfo('profile', team.slug);
  const { title, subtitle, menuItems, routePath } = pageInfo;

  return (
    <SettingsPageLayout
      title={title}
      subtitle={
        <p>
          Fill your team informations, they will be displayed on your public{' '}
          <Link
            className="underline"
            href={routes.TEAMS_PUBLIC.replace(':slug', teamSlug)}
            target="_blank"
          >
            team page
          </Link>
        </p>
      }
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
      <TeamInfo team={team} />
    </SettingsPageLayout>
  );
}
