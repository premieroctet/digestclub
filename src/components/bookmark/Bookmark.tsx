import useAddAndRemoveBlockOnDigest from '@/hooks/useAddAndRemoveBlockOnDigest';
import { TeamBookmarkedLinks } from '@/lib/queries';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { DigestBlockType } from '@prisma/client';
import { AiOutlineLoading3Quarters as LoadingIcon } from '@react-icons/all-files/ai/AiOutlineLoading3Quarters';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import BookmarkImage from './BookmarkImage';

export const Bookmark = ({
  bookmark,
  teamId,
  digestId,
}: {
  bookmark: TeamBookmarkedLinks;
  teamId: string;
  digestId: string;
} & PropsWithChildren) => {
  const { add, isRefreshing } = useAddAndRemoveBlockOnDigest({
    teamId,
    digestId,
  });
  return (
    <div className="group relative flex w-full rounded-md p-2 hover:bg-gray-50">
      <div className="flex w-full justify-between">
        <div className="flex gap-2 overflow-hidden w-[100%] justify-start">
          <div className="relative w-16 h-16 overflow-hidden rounded-md border max-w-[4rem]">
            <BookmarkImage link={bookmark.link} />
          </div>
          <div className="flex flex-col items-start max-w-[100%] overflow-hidden flex-1">
            <div className="flex flex-col overflow-hidden max-w-[100%]">
              <p className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-base text-gray-800">
                {bookmark.link.title}
              </p>
              <Link
                href={bookmark.link.url}
                target="_blank"
                className="text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis text-base underline underline-offset-2"
              >
                {bookmark.link.url}
              </Link>
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
    </div>
  );
};
