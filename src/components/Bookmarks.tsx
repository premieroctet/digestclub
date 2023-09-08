'use client';

import useCustomToast from '@/hooks/useCustomToast';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import api from '@/lib/api';
import { TeamBookmarksResult } from '@/lib/queries';
import { ApiBookmarkResponseSuccess } from '@/pages/api/teams/[teamId]/bookmark';
import { getRelativeDate } from '@/utils/date';
import { getDomainFromUrl } from '@/utils/url';
import { BsFillBookmarkFill } from '@react-icons/all-files/bs/BsFillBookmarkFill';
import { AxiosError, AxiosResponse } from 'axios';
import clsx from 'clsx';
import Link from 'next/link';
import { useMutation } from 'react-query';
import NoContent from './layout/NoContent';
import BookmarkImage from './link/BookmarkImage';
import { DeletePopover } from './Popover';
import message from '../messages/en';
import { getEnvHost } from '@/lib/server';

type Props = {
  bookmarks: TeamBookmarksResult[];
  teamId: string;
  teamSlug: string;
};

/**
 * Displays a list of bookmarks from a team
 */
export const Bookmarks = ({ bookmarks, teamId, teamSlug }: Props) => {
  const { successToast, errorToast } = useCustomToast();
  const { isRefreshing, refresh } = useTransitionRefresh();

  const { mutate: deleteBookmark, isLoading } = useMutation<
    AxiosResponse<ApiBookmarkResponseSuccess>,
    AxiosError<ErrorResponse>,
    TeamBookmarksResult
  >(
    'delete-bookmarks',
    (bookmark) => {
      return api.delete(`/teams/${teamId}/bookmark/${bookmark.id}`);
    },
    {
      onSuccess: () => {
        successToast(message.invitation.delete.success);
        refresh();
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        errorToast(
          error.response?.data?.error ||
            error.response?.statusText ||
            error.message
        );
      },
    }
  );

  if (bookmarks.length < 1) {
    return (
      <NoContent
        icon={<BsFillBookmarkFill />}
        title="No bookmark"
        subtitle="Start bookmarking links to share them with your team"
      />
    );
  }

  return (
    <div
      className={clsx(
        'flex w-full flex-col gap-2',
        isRefreshing && 'opacity-60'
      )}
    >
      {bookmarks.map((bookmark) => {
        const isUsed = bookmark.digestBlocks.length > 0;
        const nbOfTimesUsed = bookmark.digestBlocks.length;
        return (
          <div
            key={bookmark.id}
            className={clsx(
              'group relative flex w-full rounded-md p-2 hover:bg-gray-50'
            )}
          >
            {isUsed && (
              <a
                className="absolute bottom-2 right-2 items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 hover:bg-gray-100 hover:text-gray-700 z-20"
                href={`/teams/${teamSlug}/digests/${bookmark.digestBlocks[0].digest.id}/edit`}
                target="_blank"
                title="Used in digest. Click to edit the digest."
              >
                Bookmarked {nbOfTimesUsed > 1 ? nbOfTimesUsed : ''}{' '}
              </a>
            )}
            <div
              className={clsx('flex w-full justify-between', {
                'opacity-60': isUsed,
              })}
            >
              <div className="flex gap-2 overflow-hidden w-[100%] justify-start">
                <div className="relative w-16 h-16 overflow-hidden rounded-md border max-w-[4rem]">
                  <BookmarkImage
                    link={bookmark.link}
                    fallbackSrc={`${getEnvHost()}/api/bookmark-og?bookmark=${
                      bookmark.id
                    }`}
                  />
                </div>
                <div className="flex flex-col items-start max-w-[100%] overflow-hidden flex-1">
                  <div className="flex flex-col overflow-hidden max-w-[100%]">
                    <Link
                      href={bookmark.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-0 z-10"
                    >
                      <span className="truncate font-semibold whitespace-nowrap">
                        {bookmark.link.title || bookmark.link.url}
                      </span>
                    </Link>
                    <div className="flex items-center text-sm text-gray-500">
                      {bookmark.membership ? (
                        <div className="whitespace-nowrap max-w-[33%] sm:max-w-none truncate">
                          {bookmark.membership.user?.name ||
                            bookmark.membership.user?.email?.split('@')[0]}{' '}
                          {bookmark.createdAt &&
                            getRelativeDate(bookmark.createdAt)}
                        </div>
                      ) : (
                        <div className="whitespace-nowrap max-w-[33%] sm:max-w-none truncate">
                          {bookmark.provider === 'SLACK' && (
                            <>
                              From Slack{' '}
                              {bookmark.createdAt &&
                                getRelativeDate(bookmark.createdAt)}
                            </>
                          )}
                        </div>
                      )}
                      <div className="mx-1">-</div>
                      <div className="whitespace-nowrap max-w-[33%] sm:max-w-none truncate">
                        {getDomainFromUrl(bookmark.link.url)}
                      </div>
                      <div className="mx-1">-</div>
                      <div className="relative z-20">
                        <DeletePopover
                          handleDelete={() => deleteBookmark(bookmark)}
                          isLoading={isLoading || isRefreshing}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
