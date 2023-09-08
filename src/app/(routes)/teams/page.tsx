import { routes } from '@/core/constants';
import { getUserTeams } from '@/lib/queries';
import { getSession } from '@/lib/sessions';
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

  const teams = await getUserTeams(session.user.id);

  if (teams.length === 0) {
    redirect(routes.TEAMS_CREATE);
  } else {
    redirect(routes.TEAM.replace(':slug', teams[0].slug));
  }
};

export default AppPage;
