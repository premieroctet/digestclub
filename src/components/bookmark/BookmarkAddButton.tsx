import useAddAndRemoveBlockOnDigest from '@/hooks/useAddAndRemoveBlockOnDigest';
import React from 'react';
import { AiOutlineLoading3Quarters as LoadingIcon } from '@react-icons/all-files/ai/AiOutlineLoading3Quarters';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { BookmarkDigestStyle, DigestBlockType } from '@prisma/client';
import { isTwitterLink } from '@/utils/link';
import { TeamBookmarkedLinkItem } from '@/services/database/link';

interface Props {
  bookmark: TeamBookmarkedLinkItem;
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
            bookmarkId: bookmark.bookmark[0].id,
            type: DigestBlockType.BOOKMARK,
            style: isTwitterLink(bookmark.url)
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
