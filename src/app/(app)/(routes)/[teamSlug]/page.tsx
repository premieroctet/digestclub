import TeamPublicPage from '@/components/pages/TeamPublicPage';
import { getEnvHost } from '@/lib/server';
import { getDiscoverDigests } from '@/services/database/digest';
import { getTeamBySlug } from '@/services/database/team';
import { generateTeamOGUrl } from '@/utils/open-graph-url';
import { isPrismaNotFoundError } from '@/utils/prisma';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
interface PageProps {
  params: { teamSlug: string };
  searchParams?: { [key: string]: string | undefined };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const team = await getTeamBySlug(params.teamSlug);
    const url = generateTeamOGUrl(team?.slug || '');

    return {
      alternates: {
        types: {
          'application/rss+xml': `${getEnvHost()}/${params.teamSlug}/rss.xml`,
          'application/atom+xml': `${getEnvHost()}/${params.teamSlug}/atom.xml`,
        },
      },
      title: `${team?.name}`,
      twitter: {
        card: 'summary_large_image',
        title: `${team?.name}`,
        description: team?.bio || team?.name,
        images: [url],
      },
      openGraph: {
        type: 'website',
        title: `${team?.name}`,
        description: team?.bio || team?.name,
        url,
        images: [
          {
            url,
            width: 1200,
            height: 600,
          },
        ],
      },
    };
  } catch (error) {
    if (isPrismaNotFoundError(error)) {
      notFound();
    } else {
      throw error;
    }
  }
}

const PublicTeamPage = async ({ params, searchParams }: PageProps) => {
  try {
    const team = await getTeamBySlug(params.teamSlug);

    const page = Number(searchParams?.page || 1);
    const { digests, digestsCount } = await getDiscoverDigests({
      page,
      perPage: 10,
      teamId: team?.id,
    });

    if (!team) {
      redirect('/');
    }
    return (
      <TeamPublicPage
        team={team}
        digests={digests}
        digestsCount={digestsCount}
      />
    );
  } catch (error: any) {
    if (isPrismaNotFoundError(error)) {
      notFound();
    } else {
      throw error;
    }
  }
};

export default PublicTeamPage;
