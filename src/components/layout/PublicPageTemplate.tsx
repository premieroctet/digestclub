import { PublicDigestResult, PublicTeamResult } from '@/lib/queries';
import { PropsWithChildren } from 'react';
import PublicDigestHeader from '../digests/PublicDigestHeader';

interface Props {
  // @ts-ignore
  team: NonNullable<PublicTeamResult> | NonNullable<PublicDigestResult>['team'];
}

const PublicPageTemplate = ({ children, team }: PropsWithChildren & Props) => {
  return (
    <div className=" flex flex-col pb-10 items-center box-border pt-10 relative w-full md:w-[90%] lg:w-full m-auto">
      <span className="w-screen absolute h-[20rem] bg-white box-border z-4 top-[-2.5rem]"></span>
      <div className="w-full max-w-[1024px] box-border relative z-5">
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
        {children}
      </div>
    </div>
  );
};

export default PublicPageTemplate;
