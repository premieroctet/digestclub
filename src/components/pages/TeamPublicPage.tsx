import { PublicTeamResult } from '@/lib/queries';
import { getEnvHost } from '@/lib/server';
import { BookmarkIcon } from '@heroicons/react/24/solid';
import RssButton from '../RssButton';
import NoContent from '../layout/NoContent';
import PublicPageTemplate from '../layout/PublicPageTemplate';
import PublicDigestListItem from '../teams/PublicDigestListItem';

export interface Props {
  team: NonNullable<PublicTeamResult>;
}

const TeamPublicPage = ({ team }: Props) => {
  return (
    <PublicPageTemplate team={team}>
      <div className="bg-white w-fullflex-col rounded-lg border border-gray-200">
        <div className="w-full lg:mx-0 flex items-center justify-between p-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-700">
            {team.name} - All Digests
          </h2>
          <RssButton copyText={`${getEnvHost()}/${team.slug}/rss.xml`} />
        </div>
      </div>
      <div className="w-full">
        {team.Digest.length === 0 ? (
          <NoContent
            icon={<BookmarkIcon className="h-20 w-20" />}
            title="No Digest"
            subtitle="There is no public digest in this team yet."
          />
        ) : (
          <div className="mt-3 gap-4 flex flex-col">
            {team.Digest.slice(0, 10).map((digest) => (
              <PublicDigestListItem
                key={digest.slug}
                digest={digest}
                team={team}
              />
            ))}
          </div>
        )}
      </div>
    </PublicPageTemplate>
  );
};

export default TeamPublicPage;
