import authOptions from '@/app/api/auth/[...nextauth]/options';
import { routes } from '@/core/constants';
import { getCurrentUser } from '@/lib/sessions';
import { checkUserTeamBySlug } from '@/services/database/user';
import { notFound, redirect } from 'next/navigation';
import { TeamPageProps } from '../page';

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
