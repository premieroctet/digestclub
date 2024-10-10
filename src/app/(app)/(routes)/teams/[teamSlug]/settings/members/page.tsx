import authOptions from '@/app/api/auth/[...nextauth]/options';
import SettingsPageLayout from '@/components/teams/form/settings/SettingsPageLayout';
import TeamUsers from '@/components/teams/form/settings/TeamUsers';
import { routes } from '@/core/constants';
import { getCurrentUser } from '@/lib/sessions';
import { getTeamInvitations } from '@/services/database/invitation';
import { getTeamMembers } from '@/services/database/membership';
import { getTeamSubscriptions } from '@/services/database/subscription';
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
  const members = await getTeamMembers(teamSlug);
  const invitations = await getTeamInvitations(teamSlug);
  const subscriptions = await getTeamSubscriptions(teamSlug);

  const pageInfo = getTeamSettingsPageInfo('members', team.slug);
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
      <TeamUsers
        members={members}
        invitations={invitations}
        teamId={team.id.toString()}
        user={user}
        subscriptions={subscriptions}
      />
    </SettingsPageLayout>
  );
}
