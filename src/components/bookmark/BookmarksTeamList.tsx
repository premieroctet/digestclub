'use client';

import { BsFillBookmarkFill } from '@react-icons/all-files/bs/BsFillBookmarkFill';
import NoContent from '../layout/NoContent';
import { BookmarkItem } from './BookmarkItem';
import Link from 'next/link';
import SearchInput from '../digests/SearchInput';
import { TeamLinks } from '@/services/database/link';

type Props = {
  teamLinks: TeamLinks;
  teamId: string;
  teamSlug: string;
};

export const BookmarksTeamList = ({ teamLinks, teamId, teamSlug }: Props) => {
  return (
    <div className="w-full">
      <SearchInput className="mb-4" />
      {teamLinks.length < 1 ? (
        <NoContent
          icon={<BsFillBookmarkFill />}
          title="No bookmark"
          subtitle="No bookmark matched your search"
        />
      ) : (
        <div className="flex flex-col gap-2">
          {teamLinks?.map((teamLink) => (
            <Link
              key={teamLink?.id}
              href={teamLink.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BookmarkItem
                teamLink={teamLink}
                teamSlug={teamSlug}
                teamId={teamId}
                digestId={
                  teamLink.bookmark?.find(
                    (teamLink) => teamLink?.digestBlocks?.length
                  )?.digestBlocks[0].digest.id
                }
                isUsed={teamLink.bookmark?.some(
                  (teamLink) => teamLink.digestBlocks.length
                )}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
