'use client';
import {
  getTeamBySlug,
  TeamBookmarksResult,
  TeamDigestsResult,
} from '@/lib/queries';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useTransition } from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { Bookmarks } from '../Bookmarks';
import Card from '../Card';
import { CounterTag } from '../CounterTag';
import { DigestCreateInput } from '../digests/DigestCreateInput';
import { Digests } from '../digests/Digests';
import PageContainer from '../layout/PageContainer';
import Pagination from '../list/Pagination';
import { Tooltip } from '../Tooltip';

type Props = {
  linkCount: number;
  bookmarks: TeamBookmarksResult[];
  digests: TeamDigestsResult[];
  team: Awaited<ReturnType<typeof getTeamBySlug>>;
};

const Team = ({ team, linkCount, bookmarks, digests }: Props) => {
  const searchParams = useSearchParams();
  const path = usePathname();
  let [isPending, startTransition] = useTransition();
  const { replace } = useRouter();

  return (
    <PageContainer title={team.name}>
      <div className="flex max-lg:flex-col gap-5">
        <Card
          className="w-full lg:w-2/3"
          header={
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 h-8">
                <h2 className="text-xl">Bookmarks</h2>
                <CounterTag count={linkCount} />
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  title="Show unused bookmarks"
                  className={clsx(
                    'm-1 relative top-[2px] inline-flex items-center rounded-full border py-1 px-3 text-sm font-bold cursor-pointer transition ease-in-out duration-150 focus:outline-none',
                    searchParams?.get('all') === 'true' &&
                      'bg-gray-900 text-white border-black',
                    searchParams?.get('all') !== 'false' &&
                      'opacity-40 hover:opacity-100'
                  )}
                  onClick={() => {
                    if (!searchParams) return;
                    const params = new URLSearchParams(searchParams);
                    if (params.get('all') === 'true') {
                      params.delete('all');
                    } else {
                      params.set('all', 'true');
                    }
                    startTransition(() => {
                      replace(path + `?${params.toString()}`);
                    });
                  }}
                >
                  All bookmarks
                </button>
                <Pagination totalItems={linkCount} className="h-6" />
              </div>
            </div>
          }
        >
          <Bookmarks
            teamId={team.id}
            teamSlug={team.slug}
            bookmarks={bookmarks}
          />
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
            <DigestCreateInput teamId={team.id} teamSlug={team.slug} />
            <Digests digests={digests} teamId={team.id} teamSlug={team.slug} />
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Team;
