import useAddAndRemoveBlockOnDigest from '@/hooks/useAddAndRemoveBlockOnDigest';
import { getTeamBookmarksNotInDigest } from '@/lib/queries';
import Link from 'next/link';
import React from 'react';
import BookmarkImage from '../bookmark/BookmarkImage';
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
export default function BookmarkAddButton({
  bookmark,
  teamId,
  digestId,
}: Props) {
  const { add, isRefreshing } = useAddAndRemoveBlockOnDigest({
    teamId,
    digestId,
  });

  return (
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
  );
}
