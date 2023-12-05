import { COOKIES, routes } from '@/core/constants';
import { getSession } from '@/lib/sessions';
import { getUserTeams } from '@/services/database/team';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Team',
};

const AppPage = async () => {
  const session = await getSession();

  if (!session) {
    return redirect(routes.LOGIN);
  }
  const cookieStore = cookies();

  const defaultTeam = cookieStore.get(COOKIES.DEFAULT_TEAM)?.value;
  if (!defaultTeam) {
    // If the user has no default team (cookie), we need to get the teams from the database and redirect them to the first team
    const teams = await getUserTeams(session.user.id);
    if (teams.length === 0) {
      redirect(routes.TEAMS_CREATE);
    } else {
      redirect(routes.TEAM.replace(':slug', teams[0].slug));
    }
  } else {
    // If the user has a default team (cookie), we redirect them to that team
    redirect(routes.TEAM.replace(':slug', defaultTeam));
  }
};

export default AppPage;
