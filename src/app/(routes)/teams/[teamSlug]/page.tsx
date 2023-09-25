import Team from '@/components/pages/Team';
import db from '@/lib/db';
import {
  checkUserTeamBySlug,
  getTeamLinks,
  getTeamDigests,
  updateDefaultTeam,
} from '@/lib/queries';
import { getCurrentUserOrRedirect } from '@/lib/sessions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export interface TeamPageProps {
  params: { teamSlug: string };
  searchParams?: { [key: string]: string | undefined };
}

export async function generateMetadata({
  params,
}: TeamPageProps): Promise<Metadata> {
  const team = await db.team.findFirst({
    select: { name: true },
    where: {
      slug: params.teamSlug,
    },
  });
  if (!team) throw notFound();
  return { title: `Team ${team.name}` };
}

const TeamPage = async ({ params, searchParams }: TeamPageProps) => {
  const user = await getCurrentUserOrRedirect();
  const team = await checkUserTeamBySlug(params.teamSlug, user.id);
  if (!team) {
    throw notFound();
  }

  await updateDefaultTeam(user.id, team.id);

  const page = Number(searchParams?.page || 1);
  const search = searchParams?.search || '';
  const { totalCount, teamLinks } = await getTeamLinks(team.id, {
    page,
    onlyNotInDigest: !searchParams?.all,
    search,
  });

  const digests = await getTeamDigests(team.id, 1, 11);

  return (
    <Team
      team={team}
      linkCount={totalCount}
      teamLinks={teamLinks}
      digests={digests}
      search={search}
    />
  );
};

export default TeamPage;
