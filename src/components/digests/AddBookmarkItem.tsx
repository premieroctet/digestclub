import useAddAndRemoveBlockOnDigest from '@/hooks/useAddAndRemoveBlockOnDigest';
import { getTeamBookmarksNotInDigest } from '@/lib/queries';
import Link from 'next/link';
import React from 'react';
import BookmarkImage from '../link/BookmarkImage';
import { AiOutlineLoading3Quarters as LoadingIcon } from '@react-icons/all-files/ai/AiOutlineLoading3Quarters';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { getRelativeDate } from '@/utils/date';
import { getDomainFromUrl } from '@/utils/url';
import { BookmarkDigestStyle, DigestBlockType } from '@prisma/client';
import { getEnvHost } from '@/lib/server';
import { isTwitterLink } from '@/utils/link';

interface Props {
  bookmark: Awaited<
    ReturnType<typeof getTeamBookmarksNotInDigest>
  >['bookmarks'][0];
  teamId: string;
  digestId: string;
}

/**
 * Bookmark item with an add to a (specific) digest button
 */
export default function AddBookmarkItem({ bookmark, teamId, digestId }: Props) {
  const { add, isRefreshing } = useAddAndRemoveBlockOnDigest({
    teamId,
    digestId,
  });

  return (
    <div className="group relative flex w-full rounded-md p-2 hover:bg-gray-50 flex-col bg-white">
      <div className="flex w-full justify-between">
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
              <p className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-base text-gray-800">
                {bookmark.link.title}
              </p>
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
                  <Link
                    href={bookmark.link.url}
                    target="_blank"
                    className="text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis underline underline-offset-2"
                  >
                    {getDomainFromUrl(bookmark.link.url)}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-full items-center w-16">
          <button
            className="group-hover color-black w-full"
            onClick={(e) => {
              e.preventDefault();
              add.mutate({
                bookmarkId: bookmark.id,
                type: DigestBlockType.BOOKMARK,
                style: isTwitterLink(bookmark.link.url)
                  ? BookmarkDigestStyle.TWEET_EMBED
                  : BookmarkDigestStyle.BLOCK,
              });
            }}
            disabled={add.isLoading || isRefreshing}
            aria-label="Add"
          >
            {add.isLoading || isRefreshing ? (
              <LoadingIcon
                className="animate-spin h-6 w-6 m-auto text-gray-400"
                aria-hidden="true"
              />
            ) : (
              <span className="h-8 w-8 block m-auto text-gray-400 group-hover:text-gray-500  group-hover:scale-[110%] transition-[transform] duration-400">
                <PlusCircleIcon />
              </span>
            )}
          </button>
        </div>
      </div>
      {bookmark.link.description && (
        <p className="pt-2 text-sm">{bookmark.link.description}</p>
      )}
    </div>
  );
}
