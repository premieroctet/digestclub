'use client';

import { TeamBookmarkedLinks } from '@/lib/queries';
import { BsFillBookmarkFill } from '@react-icons/all-files/bs/BsFillBookmarkFill';
import NoContent from '../layout/NoContent';
import { BookmarkItem } from './BookmarkItem';
import Link from 'next/link';
import SearchInput from '../digests/SearchInput';

type Props = {
  bookmarkedLinks: TeamBookmarkedLinks;
  teamId: string;
  teamSlug: string;
};

export const BookmarksTeamList = ({
  bookmarkedLinks,
  teamId,
  teamSlug,
}: Props) => {
  return (
    <div className="w-full">
      <SearchInput className="mb-4" />
      {bookmarkedLinks.length < 1 ? (
        <NoContent
          icon={<BsFillBookmarkFill />}
          title="No bookmark"
          subtitle="No bookmark matched your search"
        />
      ) : (
        <div className="flex flex-col gap-2">
          {bookmarkedLinks?.map((bookmarkedLink) => (
            <Link
              key={bookmarkedLink?.id}
              href={bookmarkedLink.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BookmarkItem
                bookmarkedLink={bookmarkedLink}
                teamSlug={teamSlug}
                teamId={teamId}
                digestId={
                  bookmarkedLink.bookmark?.find(
                    (bookmarkedLink) => bookmarkedLink?.digestBlocks?.length
                  )?.digestBlocks[0].digest.id
                }
                isUsed={bookmarkedLink.bookmark?.some(
                  (bookmarkedLink) => bookmarkedLink.digestBlocks.length
                )}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
