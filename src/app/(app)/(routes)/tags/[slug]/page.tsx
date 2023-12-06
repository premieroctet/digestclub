import Tag from '@/components/Tag';
import Pagination from '@/components/list/Pagination';
import Homepage from '@/components/pages/Homepage';
import PublicDigestListItem from '@/components/teams/PublicDigestListItem';
import TeamAvatar from '@/components/teams/TeamAvatar';
import { getCurrentUser } from '@/lib/sessions';
import { getDiscoverDigests } from '@/services/database/digest';
import { getRecentTeams } from '@/services/database/team';
import Link from 'next/link';
export const dynamic = 'force-dynamic';

const TagsPage = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const { slug } = params;

  const page = 1;

  const recentTeams = await getRecentTeams();
  const { digests, digestsCount } = await getDiscoverDigests({
    page,
    perPage: 20,
  });
  return (
    <main className="max-w-6xl mx-auto mb-10">
      <div className="flex gap-4">
        <div className="md:w-9/12 flex justify-between items-center gap-3 w-full">
          <h1 className="font-bold text-3xl my-4 flex items-center">
            Digests tagged with &nbsp;
            <Tag
              tag={{
                id: '123',
                name: 'NextJS',
                slug: 'tag',
                description: 'tag',
              }}
              size="large"
            />
          </h1>
          <Pagination totalItems={digestsCount} itemsPerPage={20} />
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
          <div className="bg-white p-4 border border-gray-200 rounded-lg">
            <h4 className="text-xl font-bold">Active Teams</h4>
            <div className="flex flex-col gap-4 mt-4">
              {recentTeams.map((team) => (
                <Link key={team.slug} href={`/${team.slug}`}>
                  <div className="flex items-center gap-2">
                    <TeamAvatar team={team} />
                    <div className="flex flex-col">
                      <span className="font-semibold">{team?.name}</span>
                      <a
                        href={`/${team.slug}`}
                        className="hover:text-violet-600 text-xs text-slate-500"
                        title={` Browse all digests of ${team.name}`}
                        rel="noreferrer"
                      >
                        Browse all digests
                      </a>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TagsPage;
