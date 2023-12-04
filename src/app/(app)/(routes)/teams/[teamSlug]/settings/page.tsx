import { checkUserTeamBySlug } from '@/lib/queries';
import { getCurrentUser } from '@/lib/sessions';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { notFound, redirect } from 'next/navigation';
import { TeamPageProps } from '../page';
import { routes } from '@/core/constants';

const TeamSettingsPage = async ({ params }: TeamPageProps) => {
  const teamSlug = params.teamSlug;
  const user = await getCurrentUser();
  if (!user) {
    return redirect(authOptions.pages!.signIn!);
  }

  const team = await checkUserTeamBySlug(teamSlug, user.id);

  if (!team) {
    redirect('/teams');
  }

  if (!user?.id) return notFound();

  redirect(routes.TEAM_EDIT_PROFILE.replace(':slug', teamSlug));
};

export default TeamSettingsPage;
