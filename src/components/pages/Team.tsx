import { TeamDigestsResult, TeamLinks, getTeamBySlug } from '@/lib/queries';
import { BsFillBookmarkFill } from '@react-icons/all-files/bs/BsFillBookmarkFill';
import Link from 'next/link';
import Card from '../Card';
import { CounterTag } from '../CounterTag';
import { BookmarksListControls } from '../bookmark/BookmarksListControls';
import { BookmarksTeamList } from '../bookmark/BookmarksTeamList';
import { DigestCreateInput } from '../digests/DigestCreateInput';
import { Digests } from '../digests/Digests';
import NoContent from '../layout/NoContent';
import PageContainer from '../layout/PageContainer';
import Pagination from '../list/Pagination';
import SelectTemplateModal from '../digests/templates/SelectTemplateModal';
import ChartsServer from '../charts/ChartsServer';
import { Suspense } from 'react';
import ChartsSkeleton from '../charts/ChartsSkeleton';

type Props = {
  linkCount: number;
  teamLinks: TeamLinks;
  digests: TeamDigestsResult[];
  digestsCount: number;
  templates: TeamDigestsResult[];
  team: Awaited<ReturnType<typeof getTeamBySlug>>;
  search?: string;
};

const Team = ({
  team,
  linkCount,
  teamLinks,
  digests,
  digestsCount,
  search,
  templates,
}: Props) => {
  return (
    <PageContainer title={team.name}>
      <div className="flex max-lg:flex-col gap-5 pb-4">
        <Card
          className="w-full lg:w-2/3"
          contentClassName="sm:py-2 sm:px-6"
          header={
            <>
              <div className="flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
                <div className="flex items-center gap-3 h-8">
                  <h2 className="text-xl">Bookmarks</h2>
                  {/* <CounterTag count={linkCount} /> */}
                </div>

                <BookmarksListControls linkCount={linkCount} />
              </div>
              <Suspense fallback={<ChartsSkeleton />}>
                <ChartsServer linkCount={linkCount} teamId={team.id} />
              </Suspense>
            </>
          }
          footer={
            <div className="flex items-center justify-end">
              <BookmarksListControls linkCount={linkCount} />
            </div>
          }
        >
          {!search && !teamLinks?.length ? (
            <NoContent
              icon={<BsFillBookmarkFill />}
              title="No bookmark"
              subtitle="Start bookmarking links to share them with your team"
            />
          ) : (
            <BookmarksTeamList
              teamId={team.id}
              teamSlug={team.slug}
              teamLinks={teamLinks}
            />
          )}
        </Card>
        <Card
          className="w-full lg:w-1/3"
          header={
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h2 className="text-xl">Digests</h2>
                <CounterTag count={digestsCount} />
              </div>
              <Link className="text-sm underline" href={`/${team.slug}`}>
                Show all digests
              </Link>
            </div>
          }
        >
          <div className="flex flex-col gap-4 w-full">
            <div>
              <DigestCreateInput
                team={team}
                predictedDigestTitle={team?.nextSuggestedDigestTitle}
              />
              {!!templates?.length && (
                <SelectTemplateModal
                  templates={templates}
                  team={team}
                  predictedDigestTitle={team?.nextSuggestedDigestTitle}
                />
              )}
            </div>
            <Digests digests={digests} teamSlug={team.slug} />
            <Pagination
              totalItems={digestsCount}
              pageParamName="digestPage"
              className="h-6"
              itemsPerPage={8}
            />
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Team;
