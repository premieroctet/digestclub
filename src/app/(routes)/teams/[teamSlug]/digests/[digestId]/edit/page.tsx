import { DigestEditPage } from '@/components/pages/DigestEditPage';
import { TeamProvider } from '@/contexts/TeamContext';
import {
  checkUserTeamBySlug,
  getDigest,
  getTeamBookmarksNotInDigest,
  updateDefaultTeam,
} from '@/lib/queries';
import { getCurrentUserOrRedirect } from '@/lib/sessions';
import { redirect } from 'next/navigation';

export interface TeamPageProps {
  params: { teamSlug: string; digestId: string };
  searchParams?: { [key: string]: string | undefined };
}

const page = async ({ params, searchParams }: TeamPageProps) => {
  const user = await getCurrentUserOrRedirect();
  const team = await checkUserTeamBySlug(params.teamSlug, user.id);

  if (!team) {
    redirect('/teams');
  }

  await updateDefaultTeam(user.id, team.id);

  const digest = await getDigest(params.digestId);

  if (!digest || digest.teamId !== team.id) {
    redirect(`/teams/${team.slug}/digests/${params.digestId}`);
  }

  const page = Number(searchParams?.page || 1);
  const search = searchParams?.search || '';
  const dataBookmarks = await getTeamBookmarksNotInDigest(
    team.id,
    page,
    10,
    search
  );

  return (
    <TeamProvider team={team}>
      <DigestEditPage
        dataBookmarks={dataBookmarks}
        digest={digest}
        team={team}
      />
    </TeamProvider>
  );
};

export default page;
