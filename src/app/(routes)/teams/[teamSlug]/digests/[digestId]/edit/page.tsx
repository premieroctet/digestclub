import { TemplateEdit } from '@/components/digests/templates/TemplateEdit';
import { DigestEditPage } from '@/components/pages/DigestEditPage';
import { TeamProvider } from '@/contexts/TeamContext';
import {
  checkUserTeamBySlug,
  getDigest,
  getTeamLinks,
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

  const digest = await getDigest(params.digestId);

  if (!digest || digest.teamId !== team.id) {
    redirect(`/teams/${team.slug}/digests/${params.digestId}`);
  }

  const page = Number(searchParams?.page || 1);
  const search = searchParams?.search || '';
  const teamLinksData = await getTeamLinks(team.id, {
    page,
    onlyNotInDigest: true,
    search,
  });

  return (
    <TeamProvider team={team}>
      {digest?.isTemplate ? (
        <TemplateEdit template={digest} team={team} />
      ) : (
        <DigestEditPage
          teamLinksData={teamLinksData}
          digest={digest}
          team={team}
        />
      )}
    </TeamProvider>
  );
};

export default page;
