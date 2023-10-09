import { PublicTeamResult } from '@/lib/queries';
import { getEnvHost } from '@/lib/server';
import { BookmarkIcon } from '@heroicons/react/24/solid';
import RssButton from '../RssButton';
import SubscribeToNewsLetter from '../digests/SubscribeToNewsletter';
import NoContent from '../layout/NoContent';
import PublicPageTemplate from '../layout/PublicPageTemplate';
import PublicDigestCard from '../teams/PublicDigestCard';

export interface Props {
  team: NonNullable<PublicTeamResult>;
}

const TeamPublicPage = ({ team }: Props) => {
  return (
    <PublicPageTemplate team={team}>
      <div className="bg-white w-full p-4 md:p-0 pb-10 shadow-2xl flex-col rounded-xl">
        <div className="px-0 md:px-10 py-2 md:py-8 w-full">
          <div className="w-full lg:mx-0 px-2 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-gray-700 sm:text-2xl">
              Latest Digests
            </h2>
            <RssButton copyText={`${getEnvHost()}/${team.slug}/rss.xml`} />
          </div>

          {team.Digest.length === 0 ? (
            <NoContent
              icon={<BookmarkIcon className="h-8 w-8" />}
              title="No Digest"
              subtitle="There is no public digest in this team yet."
            />
          ) : (
            <div className="mt-3 gap-3 grid sm:grid-cols-3">
              {team.Digest.slice(0, 10).map((digest) => (
                <PublicDigestCard
                  key={digest.slug}
                  digest={digest}
                  team={team}
                />
              ))}
            </div>
          )}
        </div>
        <SubscribeToNewsLetter teamId={team.id} />
      </div>
    </PublicPageTemplate>
  );
};

export default TeamPublicPage;
