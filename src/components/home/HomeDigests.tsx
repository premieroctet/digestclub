import { getDiscoverDigests } from '@/services/database/digest';
import PublicDigestCard from '../teams/PublicDigestCard';

const HomeDigests = async () => {
  const { digests } = await getDiscoverDigests({
    page: 1,
    perPage: 3,
  });

  return (
    <div className="p-4 m-auto max-w-5xl pt-10 pb-20 text-gray-900 w-full h-full flex flex-col items-center">
      <h2 className="pb-12 font-[800] text-2xl lg:text-3xl text-center flex flex-col ">
        <span>Community digests</span>
      </h2>
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
    </div>
  );
};

export default HomeDigests;
