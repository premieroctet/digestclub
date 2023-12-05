import Team from '@/components/pages/Team';
import db from '@/lib/db';
import { getCurrentUserOrRedirect } from '@/lib/sessions';
import { getTeamDigests } from '@/services/database/digest';
import { countAllTeamLinks, getTeamLinks } from '@/services/database/link';
import { checkUserTeamBySlug } from '@/services/database/user';
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

  const linksPage = Number(searchParams?.page || 1);
  const search = searchParams?.search || '';
  const { teamLinks } = await getTeamLinks(team.id, {
    page: linksPage,
    onlyNotInDigest: !searchParams?.all,
    search,
  });
  const totalLinksCount = await countAllTeamLinks(team.id);

  const digestsPage = Number(searchParams?.digestPage || 1);
  const { digests, digestsCount } = await getTeamDigests(
    team.id,
    digestsPage,
    8
  );
  const { digests: templates } = await getTeamDigests(team.id, 1, 30, true);

  return (
    <Team
      team={team}
      linkCount={totalLinksCount}
      teamLinks={teamLinks}
      digests={digests}
      digestsCount={digestsCount}
      search={search}
      templates={templates}
    />
  );
};

export default TeamPage;
