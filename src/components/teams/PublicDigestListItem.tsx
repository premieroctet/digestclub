import { DiscoveryDigest } from '@/services/database/digest';
import { formatDate } from '@/utils/date';
import { generateDigestOGUrl } from '@/utils/open-graph-url';
import { Team } from '@prisma/client';
import Link from 'next/link';
import BookmarkImage from '../bookmark/BookmarkImage';
import BookmarkCountBadge from './BookmarkCountBadge';
import TeamAvatar from './TeamAvatar';

interface Props {
  digest: DiscoveryDigest;
  showTeam?: boolean;
  team: Partial<Team>;
}

const PublicDigestListItem = ({ digest, showTeam, team }: Props) => {
  const { title, description, publishedAt, digestBlocks } = digest;
  const url = new URL(generateDigestOGUrl(digest.slug));

  return (
    <div className="overflow-hidden flex relative ">
      <Link
        href={`/${team.slug}/${digest.slug}`}
        rel="noopener noreferrer"
        className="inset-0 absolute z-20 cursor-pointer"
      />
      <article className="flex flex-col items-start w-full bg-white py-6 px-6 border border-gray-200 rounded-md">
        {showTeam && (
          <div className="flex items-center gap-x-1 text-xs">
            <Link href={`/${team.slug}`} className="relative z-30 group">
              <span className="flex items-center justify-center gap-2">
                <TeamAvatar team={team} />
                <span className="group-hover:text-violet-700">
                  {team?.name}
                </span>
              </span>
            </Link>
          </div>
        )}
        <div className="flex justify-between items-center w-full">
          <h3 className="mt-1 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
            <span className="text-2xl font-bold">{title}</span>
          </h3>
          <time className="text-gray-500 text-xs">
            {formatDate(publishedAt!, 'MMMM dd, yyyy')}
          </time>
        </div>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
          {description}
        </p>
        <div className="mt-4">
          {digestBlocks && <BookmarkCountBadge count={digestBlocks.length} />}
        </div>
        <div className="flex mt-2 overflow-hidden items-center gap-2">
          {digest.digestBlocks.slice(0, 5).map((bookmark) => (
            <div
              key={bookmark.id}
              className="h-24 w-36 relative border border-gray-200 rounded-sm overflow-hidden"
            >
              <BookmarkImage link={bookmark.bookmark!.link} />
            </div>
          ))}
        </div>
      </article>
    </div>
  );
};

export default PublicDigestListItem;
