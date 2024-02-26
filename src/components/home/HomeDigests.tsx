import { getDiscoverDigests } from '@/services/database/digest';
import PublicDigestCard from '../teams/PublicDigestCard';
import Section from './Section';

const HomeDigests = async () => {
  const { digests } = await getDiscoverDigests({
    page: 1,
    perPage: 3,
  });

  return (
    <Section
      title="Community Digests"
      caption="Explore digests from other teams to dig up relevant content."
      className="max-w-5xl"
    >
      <div className="flex max-lg:flex-col lg:space-x-10 max-lg:space-y-12">
        <div className="gap-3 grid md:grid-cols-3 xs:grid-cols-2">
          {digests.map((digest) => (
            <PublicDigestCard
              key={digest.id}
              digest={digest}
              team={digest?.team}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default HomeDigests;
