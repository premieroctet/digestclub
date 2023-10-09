import PageContainer from '@/components/layout/PageContainer';
import Pagination from '@/components/list/Pagination';
import PublicDigestCard from '@/components/teams/PublicDigestCard';
import { getDiscoverDigests } from '@/lib/queries';

export interface TeamPageProps {
  params: { teamSlug: string };
  searchParams?: { [key: string]: string | undefined };
}

const DiscoverPage = async ({ params, searchParams }: TeamPageProps) => {
  const page = Number(searchParams?.page || 1);
  const { digests, totalCount } = await getDiscoverDigests({
    page,
    perPage: 12,
  });

  return (
    <PageContainer title="Discover latest digests">
      <div className="flex gap-4 flex-col py-6">
        <Pagination totalItems={totalCount} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {digests.map((digest) => (
            <PublicDigestCard
              key={digest.id}
              digest={digest}
              team={digest?.team}
              showTeam
            />
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default DiscoverPage;
