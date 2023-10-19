import db from '@/lib/db';
import { DigestBlockType } from '@prisma/client';
import PublicDigestCard from '../teams/PublicDigestCard';

const HomeDigests = async () => {
  const digests = await db.digest.findMany({
    take: 3,
    orderBy: { publishedAt: 'desc' },
    where: { publishedAt: { not: null } },
    select: {
      id: true,
      publishedAt: true,
      title: true,
      description: true,
      slug: true,
      team: true,
      digestBlocks: {
        select: {
          id: true,
          bookmark: {
            select: {
              link: {
                select: { title: true, blurHash: true, url: true, image: true },
              },
            },
          },
        },
        where: { type: DigestBlockType.BOOKMARK },
      },
    },
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
