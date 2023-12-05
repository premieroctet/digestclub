import { formatDate } from '@/utils/date';
import { generateDigestOGUrl } from '@/utils/open-graph-url';
import { Team } from '@prisma/client';
import Link from 'next/link';
import BookmarkCountBadge from './BookmarkCountBadge';
import TeamAvatar from './TeamAvatar';
import { DiscoveryDigest } from '@/services/database/digest';

interface Props {
  digest: DiscoveryDigest;
  showTeam?: boolean;
  team: Partial<Team>;
}

const PublicDigestCard = ({ digest, showTeam, team }: Props) => {
  const { title, description, publishedAt, digestBlocks } = digest;
  const url = new URL(generateDigestOGUrl(digest.slug));

  return (
    <Link
      href={`/${team.slug}/${digest.slug}`}
      className="overflow-hidden flex cursor-pointer p-2"
      rel="noopener noreferrer"
    >
      <article className="flex flex-col items-start w-full">
        <div className="relative w-full aspect-[16/9] rounded-2xl bg-gray-100 sm:aspect-[2/1] lg:aspect-[3/2] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${url.pathname}${url.search}`}
            alt="Digest Image"
            className="object-cover object-left w-full h-full"
          />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
        </div>
        <div className="max-w-xl">
          <div className="mt-4 flex items-center gap-x-1 text-xs">
            <Link href={`/${team.slug}`}>
              <div className="flex items-center justify-center gap-2">
                {showTeam && <TeamAvatar team={team} />}
                <span>{team?.name}</span>
              </div>
            </Link>

            <time className="text-gray-500">
              - {formatDate(publishedAt!, 'MMMM dd, yyyy')}
            </time>
          </div>
          <div className="group relative">
            <h3 className="mt-1 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600 flex gap-1">
              <span className="absolute inset-0" />
              <span>{title}</span>
              <div>
                {digestBlocks && (
                  <BookmarkCountBadge count={digestBlocks.length} />
                )}
              </div>
            </h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
              {description}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PublicDigestCard;
