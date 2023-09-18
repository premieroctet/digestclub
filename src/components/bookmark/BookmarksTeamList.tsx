'use client';

import { TeamBookmarksResult } from '@/lib/queries';
import { BsFillBookmarkFill } from '@react-icons/all-files/bs/BsFillBookmarkFill';
import NoContent from '../layout/NoContent';
import { BookmarkItem } from './BookmarkItem';
import Link from 'next/link';
import SearchInput from '../digests/SearchInput';

type Props = {
  bookmarks: TeamBookmarksResult[];
  teamId: string;
  teamSlug: string;
};

export const BookmarksTeamList = ({ bookmarks, teamId, teamSlug }: Props) => {
  return (
    <div className="w-full">
      <SearchInput className="mb-4" />
      {bookmarks.length < 1 ? (
        <NoContent
          icon={<BsFillBookmarkFill />}
          title="No bookmark"
          subtitle="No bookmark matched your search"
        />
      ) : (
        <div className="flex flex-col gap-2">
          {bookmarks.map((bookmark) => (
            <Link
              key={bookmark?.id}
              href={bookmark.link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BookmarkItem
                bookmark={bookmark}
                teamSlug={teamSlug}
                teamId={teamId}
                digestId={bookmark.digestBlocks[0]?.digest.id}
                nbOfTimesUsed={bookmark.digestBlocks.length}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
