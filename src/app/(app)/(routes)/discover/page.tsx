import ActiveTeams from '@/components/ActiveTeams';
import TagsList from '@/components/TagsList';
import Pagination from '@/components/list/Pagination';
import PublicDigestListItem from '@/components/teams/PublicDigestListItem';
import { getDiscoverDigests } from '@/services/database/digest';
import { getAllTags, getPopularTags } from '@/services/database/tag';
import { getRecentTeams } from '@/services/database/team';

export interface TeamPageProps {
  params: { teamSlug: string };
  searchParams?: { [key: string]: string | undefined };
}

const PER_PAGE = 10;

const DiscoverPage = async ({ searchParams }: TeamPageProps) => {
  const page = Number(searchParams?.page || 1);

  const recentTeams = await getRecentTeams();
  const popularTags = await getPopularTags();
  const allTags = await getAllTags();

  const { digests, digestsCount } = await getDiscoverDigests({
    page,
    perPage: PER_PAGE,
  });

  return (
    <main className="max-w-6xl mx-auto mb-10">
      <div className="flex gap-4">
        <div className="md:w-9/12 flex justify-between items-center gap-3 w-full">
          <h1 className="font-bold text-3xl my-4">Community Digests</h1>
          <Pagination totalItems={digestsCount} itemsPerPage={PER_PAGE} />
        </div>
        <div className="md:max-w-[22rem] md:block hidden w-full"></div>
      </div>
      <div className="flex md:flex-row gap-4 flex-col ">
        <div className="md:w-9/12">
          <div className="flex gap-4 flex-col">
            <div className="flex gap-4 flex-col">
              {digests.map((digest) => (
                <PublicDigestListItem
                  key={digest.id}
                  digest={digest}
                  team={digest?.team}
                  showTeam
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:max-w-[22rem] w-full">
          <ActiveTeams teams={recentTeams} />
          <TagsList
            tags={popularTags}
            title="Popular tags"
            description="Browse digests by the most used tags"
          />
          <TagsList
            tags={allTags}
            title="Tags"
            description="Browse digests by tags"
          />
        </div>
      </div>
    </main>
  );
};

export default DiscoverPage;
