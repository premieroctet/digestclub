'use client';

import {
  TeamBookmarksNotInDigestResult,
  TeamBookmarksResult,
} from '@/lib/queries';
import { getRelativeDate } from '@/utils/date';
import { getDomainFromUrl } from '@/utils/url';
import clsx from 'clsx';
import BookmarkImage from './BookmarkImage';
import { DeletePopover } from '../Popover';
import { getEnvHost } from '@/lib/server';

import api from '@/lib/api';
import { ApiBookmarkResponseSuccess } from '@/pages/api/teams/[teamId]/bookmark';

import { AxiosError, AxiosResponse } from 'axios';

import { useMutation } from 'react-query';

import message from '../../messages/en';
import useCustomToast from '@/hooks/useCustomToast';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import BookmarkAddButton from './BookmarkAddButton';
import Link from 'next/link';

type Props = {
  bookmark:
    | TeamBookmarksResult
    | TeamBookmarksNotInDigestResult['bookmarks'][0];
  teamSlug: string;
  teamId: string;
  digestId?: string;
  nbOfTimesUsed?: number;
  editMode?: boolean;
};

export const BookmarkItem = ({
  bookmark,
  teamSlug,
  teamId,
  digestId,
  nbOfTimesUsed,
  editMode,
}: Props) => {
  const { successToast, errorToast } = useCustomToast();
  const { isRefreshing, refresh } = useTransitionRefresh();

  const { mutate: deleteBookmark, isLoading: isDeleting } = useMutation<
    AxiosResponse<ApiBookmarkResponseSuccess>,
    AxiosError<ErrorResponse>,
    { bookmarkId: string }
  >(
    'delete-bookmarks',
    ({ bookmarkId }) => {
      console.log(bookmarkId, teamId);
      return api.delete(`/teams/${teamId}/bookmark/${bookmarkId}`);
    },
    {
      onSuccess: () => {
        successToast(message.bookmark.delete.success);
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

  const isLoading = isRefreshing || isDeleting;
  const isUsed = !!nbOfTimesUsed && !editMode;

  return (
    <div
      key={bookmark.id}
      className={clsx(
        'group relative flex w-full rounded-md p-2 hover:bg-gray-50 flex-col',
        { 'opacity-60': isRefreshing }
      )}
    >
      {isUsed && (
        <a
          className="absolute bottom-0 right-2 items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 hover:bg-gray-100 hover:text-gray-700 z-20"
          href={`/teams/${teamSlug}/digests/${digestId}/edit`}
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
              <span className="truncate font-semibold whitespace-nowrap">
                {bookmark.link.title || bookmark.link.url}
              </span>

              <div className="flex items-center text-sm text-gray-500">
                {bookmark.membership ? (
                  <div className="whitespace-nowrap max-w-[33%] sm:max-w-none truncate">
                    {bookmark.membership.user?.name ||
                      bookmark.membership.user?.email?.split('@')[0]}{' '}
                    {bookmark.createdAt && getRelativeDate(bookmark.createdAt)}
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
                  {editMode ? (
                    <Link
                      href={bookmark.link.url}
                      target="_blank"
                      className="text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis underline underline-offset-2"
                    >
                      {getDomainFromUrl(bookmark.link.url)}
                    </Link>
                  ) : (
                    getDomainFromUrl(bookmark.link.url)
                  )}
                </div>
                <div className="mx-1">-</div>
                <div className="relative z-20">
                  <DeletePopover
                    handleDelete={() =>
                      deleteBookmark({ bookmarkId: bookmark?.id })
                    }
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {editMode && digestId && (
          <BookmarkAddButton
            bookmark={bookmark}
            teamId={teamId}
            digestId={digestId}
          />
        )}
      </div>
      {bookmark.link.description && (
        <p className={clsx('pt-2 text-sm', { 'opacity-60': isUsed })}>
          {bookmark.link.description}
        </p>
      )}
    </div>
  );
};
