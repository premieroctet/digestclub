import { PublicTeamResult } from '@/lib/queries';
import { formatDate } from '@/utils/date';
import { generateDigestOGUrl } from '@/utils/open-graph-url';
import Link from 'next/link';
import TeamAvatar from './TeamAvatar';
import { Team } from '@prisma/client';

interface Props {
  digest: NonNullable<PublicTeamResult>['Digest'][number];
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
          <div className="mt-8 flex items-center gap-x-4 text-xs">
            <Link href={`/${team.slug}`}>
              <div className="flex items-center justify-center">
                {showTeam && <TeamAvatar team={team} />}
                <span className="pl-2">{team?.name}</span>
              </div>
            </Link>

            <time className="text-gray-500">
              {formatDate(publishedAt!, 'MMMM dd, yyyy')}
            </time>
          </div>
          <div className="group relative">
            <h3 className="mt-1 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
              <span className="absolute inset-0" />
              {title}
              {digestBlocks && (
                <span className="ml-2 bg-violet-100 text-violet-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-violet-900 dark:text-violet-300">
                  {digestBlocks?.length} bookmark
                  {digestBlocks?.length === 1 ? '' : 's'}
                </span>
              )}
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
