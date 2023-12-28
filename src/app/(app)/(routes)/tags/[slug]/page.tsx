import Tag from '@/components/Tag';
import Pagination from '@/components/list/Pagination';
import PublicDigestListItem from '@/components/teams/PublicDigestListItem';
import TeamAvatar from '@/components/teams/TeamAvatar';
import { getDiscoverDigests } from '@/services/database/digest';
import { getPopularTags, getTagBySlug } from '@/services/database/tag';
import { getRecentTeams } from '@/services/database/team';
import { Button } from '@tremor/react';
import Link from 'next/link';
import CustomLink from '@/components/Link';
import { notFound } from 'next/navigation';
import PopularTags from '@/components/PopularTags';
import ActiveTeams from '@/components/ActiveTeams';
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
  const tag = await getTagBySlug(slug);
  if (!tag) return notFound();
  const recentTeams = await getRecentTeams();
  const { digests, digestsCount } = await getDiscoverDigests({
    page,
    perPage: 20,
    tagId: tag.id,
  });
  const popularTags = await getPopularTags();

  return (
    <main className="max-w-6xl mx-auto mb-10">
      <div className="flex gap-4">
        <div className="md:w-9/12 flex justify-between items-center gap-3 w-full">
          <h1 className="font-bold text-3xl my-4 flex items-center">
            <span>Digests tagged with </span>&nbsp;
            <span className="text-violet-700">{tag.name}</span>
          </h1>
          <Pagination totalItems={digestsCount} itemsPerPage={20} />
        </div>
        <div className="md:max-w-[22rem] md:block hidden w-full"></div>
      </div>
      <div className="flex md:flex-row gap-4 flex-col ">
        <div className="md:w-9/12">
          <div className="flex gap-4 flex-col">
            {digestsCount > 0 ? (
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
            ) : (
              <div className="flex flex-col items-start w-full bg-white py-6 px-6 border border-gray-200 rounded-md gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-bold">
                    No digests found for this topic
                  </h3>
                  <p className="text-base text-slate-500">
                    {` We couldn't find any digests tagged with ${tag.name}. Try a different tag or browse all digests.`}
                  </p>
                </div>
                <CustomLink
                  href="/discover"
                  className="mt-4"
                  variant="ghost"
                  title="Browse all digests"
                >
                  Browse all digests
                </CustomLink>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 md:max-w-[22rem] w-full">
          <ActiveTeams teams={recentTeams} />

          <PopularTags tags={popularTags} currentTag={tag} />
        </div>
      </div>
    </main>
  );
};

export default TagsPage;
