'use client';

import { getEnvHost } from '@/lib/server';
import { getRelativeDate } from '@/utils/date';
import { getDomainFromUrl } from '@/utils/url';
import clsx from 'clsx';
import BookmarkImage from './BookmarkImage';

import { ResponseSuccess } from '@/app/api/teams/[teamId]/bookmark/[bookmarkId]/route';
import api from '@/lib/api';

import { AxiosError, AxiosResponse } from 'axios';

import { useMutation } from 'react-query';

import useCustomToast from '@/hooks/useCustomToast';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import { TeamBookmarkedLinkItem } from '@/services/database/link';
import Link from 'next/link';
import message from '../../messages/en';
import { DeletePopover, MultipleDeletePopover } from '../Popover';
import { Tooltip } from '../Tooltip';
import BookmarkAddButton from './BookmarkAddButton';

type Props = {
  teamLink: TeamBookmarkedLinkItem;
  teamSlug: string;
  teamId: string;
  digestId?: string;
  isUsed?: boolean;
  editMode?: boolean;
};

export const getContributor = (
  bookmark: TeamBookmarkedLinkItem['bookmark'][number]
) => {
  let name = '';
  if (bookmark.membership)
    name = `${
      bookmark.membership.user?.name ||
      bookmark.membership.user?.email?.split('@')[0]
    } 
  ${bookmark.createdAt && getRelativeDate(bookmark.createdAt)}`;

  if (bookmark.provider === 'SLACK')
    name = `From Slack
      ${bookmark.createdAt && getRelativeDate(bookmark.createdAt)}`;

  return name;
};

export const getContributorsString = (
  bookmarks: TeamBookmarkedLinkItem['bookmark']
) => {
  let contributors: string[] = [];
  bookmarks?.map((bookmark) => {
    contributors.push(getContributor(bookmark));
  });

  return contributors.join(' / ');
};

export const BookmarkItem = ({
  teamLink,
  teamSlug,
  teamId,
  digestId,
  isUsed,
  editMode,
}: Props) => {
  const { successToast, errorToast } = useCustomToast();
  const { isRefreshing, refresh } = useTransitionRefresh();
  const bookmarksNumber = teamLink.bookmark?.length;

  const { mutate: deleteBookmark, isLoading: isDeleting } = useMutation<
    AxiosResponse<ResponseSuccess>,
    AxiosError<ErrorResponse>,
    { bookmarkId: string }
  >(
    'delete-bookmarks',
    ({ bookmarkId }) => {
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

  return (
    <div
      key={teamLink?.id}
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
          Published
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
              link={teamLink}
              fallbackSrc={`${getEnvHost()}/api/bookmark-og?bookmark=${
                teamLink.id
              }`}
            />
          </div>
          <div className="flex flex-col items-start max-w-[100%] overflow-hidden flex-1">
            <div className="flex flex-col overflow-hidden max-w-[100%]">
              <span className="truncate font-semibold whitespace-nowrap">
                {teamLink.title || teamLink.url}
              </span>

              <div className="flex items-center text-sm text-gray-500">
                {bookmarksNumber > 1 ? (
                  <Tooltip
                    trigger={
                      <div>
                        <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 cursor-auto">
                          Bookmarked {bookmarksNumber} times
                        </span>
                      </div>
                    }
                  >
                    {getContributorsString(teamLink.bookmark)}
                  </Tooltip>
                ) : (
                  <div className="whitespace-nowrap max-w-[33%] sm:max-w-none truncate">
                    {getContributorsString(teamLink.bookmark)}
                  </div>
                )}
                <div className="mx-1">-</div>
                <div className="whitespace-nowrap max-w-[33%] sm:max-w-none truncate">
                  {editMode ? (
                    <Link
                      href={teamLink.url}
                      target="_blank"
                      className="text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis underline underline-offset-2"
                    >
                      {getDomainFromUrl(teamLink.url)}
                    </Link>
                  ) : (
                    <span className="cursor-auto">
                      {getDomainFromUrl(teamLink.url)}
                    </span>
                  )}
                </div>
                <div className="mx-1">-</div>
                <div className="relative" onClick={(e) => e.preventDefault()}>
                  {bookmarksNumber > 1 ? (
                    <MultipleDeletePopover
                      onDelete={(bookmarkId) => deleteBookmark({ bookmarkId })}
                      bookmarks={teamLink.bookmark}
                      isLoading={isLoading}
                    />
                  ) : (
                    <DeletePopover
                      handleDelete={() =>
                        deleteBookmark({
                          bookmarkId: teamLink.bookmark[0]?.id,
                        })
                      }
                      isLoading={isLoading}
                    />
                  )}
                </div>
              </div>
            </div>
            {teamLink.description && (
              <p className={clsx('pt-2 text-sm', { 'opacity-60': isUsed })}>
                {teamLink.description}
              </p>
            )}
          </div>
        </div>
        {editMode && digestId && (
          <BookmarkAddButton
            bookmark={teamLink}
            teamId={teamId}
            digestId={digestId}
          />
        )}
      </div>
    </div>
  );
};
