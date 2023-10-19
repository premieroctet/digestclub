import { PublicDigestResult, PublicTeamResult } from '@/lib/queries';
import { PropsWithChildren } from 'react';
import PublicDigestHeader from '../digests/PublicDigestHeader';
import SubscribeToNewsLetter from '../digests/SubscribeToNewsletter';

interface Props {
  // @ts-ignore
  team: NonNullable<PublicTeamResult> | NonNullable<PublicDigestResult>['team'];
}

const PublicPageTemplate = ({ children, team }: PropsWithChildren & Props) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row max-w-6xl mx-auto">
      <div className="md:w-9/12">{children}</div>
      <div className="flex flex-col gap-4 md:max-w-[22rem]">
        <PublicDigestHeader
          team={{
            name: team.name,
            ...(team.bio && { bio: team.bio }),
            ...(team.github && { github: team.github }),
            ...(team.twitter && { twitter: team.twitter }),
            ...(team.website && { website: team.website }),
            ...(team.slug && { slug: team.slug }),
          }}
        />
        <SubscribeToNewsLetter teamName={team.name} teamId={team.id} />
      </div>
    </div>
  );
};

export default PublicPageTemplate;
