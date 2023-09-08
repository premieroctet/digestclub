import { PublicDigestResult } from '@/lib/queries';
import PublicDigestHeader from '../digests/PublicDigestHeader';
import PublicDigestList from '../digests/PublicDigestList';

export interface Props {
  digest: NonNullable<PublicDigestResult>;
}
const DigestPublicPage = ({ digest }: Props) => {
  const { team } = digest;

  return (
    <div className="flex flex-col pb-10 items-center box-border pt-5 md:pt-10 relative w-full md:w-[90%] lg:w-full m-auto">
      <div className="w-full m-auto max-w-3xl box-border relative z-5">
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
        <PublicDigestList digest={digest} />
      </div>
    </div>
  );
};

export default DigestPublicPage;
