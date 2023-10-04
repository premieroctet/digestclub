'use client';
import { getTeamBySlug, TeamLinks, TeamDigestsResult } from '@/lib/queries';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { BookmarksTeamList } from '../bookmark/BookmarksTeamList';
import Card from '../Card';
import { CounterTag } from '../CounterTag';
import { DigestCreateInput } from '../digests/DigestCreateInput';
import { Digests } from '../digests/Digests';
import PageContainer from '../layout/PageContainer';
import { Tooltip } from '../Tooltip';
import { BookmarksListControls } from '../bookmark/BookmarksListControls';
import NoContent from '../layout/NoContent';
import { BsFillBookmarkFill } from '@react-icons/all-files/bs/BsFillBookmarkFill';

type Props = {
  linkCount: number;
  teamLinks: TeamLinks;
  digests: TeamDigestsResult[];
  team: Awaited<ReturnType<typeof getTeamBySlug>>;
  search?: string;
};

const Team = ({ team, linkCount, teamLinks, digests, search }: Props) => {
  return (
    <PageContainer title={team.name}>
      <div className="flex max-lg:flex-col gap-5 pb-4">
        <Card
          className="w-full lg:w-2/3"
          header={
            <div className="flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
              <div className="flex items-center gap-3 h-8">
                <h2 className="text-xl">Bookmarks</h2>
                <CounterTag count={linkCount} />
              </div>
              <BookmarksListControls linkCount={linkCount} />
            </div>
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
                <CounterTag count={digests.length} />
              </div>
              <Tooltip
                trigger={
                  <Link href={`/${team.slug}`}>
                    <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-500 rounded-md hover:text-gray-700" />
                  </Link>
                }
              >
                Show all digests
              </Tooltip>
            </div>
          }
        >
          <div className="flex flex-col gap-4 w-full">
            <DigestCreateInput
              teamId={team.id}
              teamSlug={team.slug}
              predictedDigestTitle={team?.nextSuggestedDigestTitle}
            />
            <Digests digests={digests} teamSlug={team.slug} />
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Team;
