import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import { TeamDigestsResult } from '@/lib/queries';
import { CheckIcon } from '@heroicons/react/24/solid';
import { DigestBlockType } from '@prisma/client';
import clsx from 'clsx';
import Link from 'next/link';
import NoContent from '../layout/NoContent';

type Props = {
  digests: TeamDigestsResult[];
  teamSlug: string;
};

export const Digests = ({ digests, teamSlug }: Props) => {
  const { isRefreshing } = useTransitionRefresh();

  if (digests.length < 1) {
    return <NoContent title="No digest" subtitle="Create your first digest" />;
  }

  return (
    <div
      className={clsx('flex flex-col gap-3 ', { 'opacity-60': isRefreshing })}
    >
      {digests.map((digest) => {
        const bookmarkCount = digest.digestBlocks.filter(
          (block) => block.type === DigestBlockType.BOOKMARK
        )?.length;

        return (
          <div
            key={digest.id}
            className="flex flex-col w-full relative p-2 rounded-md hover:bg-gray-50"
          >
            <Link
              href={`/teams/${teamSlug}/digests/${digest.id}/edit`}
              prefetch={false}
              className="font-semibold text-base truncate hover:no-underline text-gray-800 before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-0"
            >
              {digest.title}
            </Link>
            <div className="flex items-center text-sm text-gray-500">
              {digest.publishedAt ? (
                <div className="flex items-center">
                  <CheckIcon className="text-green-600 h-4 w-4" /> Published
                </div>
              ) : (
                <div>Draft</div>
              )}
              <div className="mx-1">-</div>
              <div>
                {`${bookmarkCount} bookmark${bookmarkCount > 1 ? 's' : ''}`}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
