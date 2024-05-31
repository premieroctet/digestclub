'use client';

import { TeamLinks } from '@/services/database/link';
import { Team } from '@prisma/client';
import { BsFillBookmarkFill } from '@react-icons/all-files/bs/BsFillBookmarkFill';
import Link from 'next/link';
import SearchInput from '../digests/SearchInput';
import NoContent from '../layout/NoContent';
import { BookmarkItem } from './BookmarkItem';
import CreateBookmarkButton from './CreateBookmarkButton';

type Props = {
  teamLinks: TeamLinks;
  team: Team;
};

export const BookmarksTeamList = ({ teamLinks, team }: Props) => {
  return (
    <div className="w-full">
      <div className="flex w-full justify-start items-center gap-4 mb-4">
        <div className="flex-1">
          <SearchInput />
        </div>
        <div className="flex">
          <CreateBookmarkButton team={team} />
        </div>
      </div>

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
                teamSlug={team.slug}
                teamId={team.id}
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
