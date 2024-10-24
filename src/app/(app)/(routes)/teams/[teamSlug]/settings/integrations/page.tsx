import authOptions from '@/app/api/auth/[...nextauth]/options';
import SettingsPageLayout from '@/components/teams/form/settings/SettingsPageLayout';
import TeamIntegrations from '@/components/teams/form/settings/TeamIntegrations';
import { routes } from '@/core/constants';
import { getCurrentUser } from '@/lib/sessions';
import { checkUserTeamBySlug } from '@/services/database/user';
import { getTeamSettingsPageInfo } from '@/utils/page';
import { redirect } from 'next/navigation';
import { TeamPageProps } from '../../page';

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

  const pageInfo = getTeamSettingsPageInfo('integrations', team.slug);
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
      <TeamIntegrations team={team} />
    </SettingsPageLayout>
  );
}
