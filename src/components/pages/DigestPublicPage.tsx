import { PublicDigestResult } from '@/lib/queries';
import PublicDigestHeader from '../digests/PublicDigestHeader';
import PublicDigestList from '../digests/PublicDigestList';
import SubscribeToNewsLetter from '../digests/SubscribeToNewsletter';

export interface Props {
  digest: NonNullable<PublicDigestResult>;
}
const DigestPublicPage = ({ digest }: Props) => {
  const { team } = digest;

  return (
    <div className="flex flex-col gap-4 md:flex-row mb-5 max-w-6xl mx-auto">
      <div className="md:w-9/12">
        <PublicDigestList digest={digest} />
      </div>
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
        <SubscribeToNewsLetter teamName={team.name} teamId={digest.team.id} />
      </div>
    </div>
  );
};

export default DigestPublicPage;
