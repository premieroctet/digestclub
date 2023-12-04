import ChangelogPost from '@/components/changelog/ChangelogPost';
import { Metadata } from 'next';
import { allChangelogs, Changelog } from 'contentlayer/generated';
import HomeFooter from '@/components/home/HomeFooter';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    'All the latest updates, improvements, and fixes to Digest.club.',
};

export default async function Updates() {
  return (
    <main>
      <div className="w-full bg-white pb-20">
        <div className="mx-6 xl:mx-auto max-w-screen-xl">
          <h1 className="hidden font-display text-4xl font-bold tracking-tight text-gray-800 md:text-5xl">
            Updates
          </h1>
          <div className="max-w-none grid grid-cols-1 divide-y gap-7">
            {allChangelogs
              .sort((a, b) => {
                if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
                  return -1;
                }
                return 1;
              })
              .map((changelog, i) => (
                <div key={i} className="w-full flex-col mt-2">
                  <ChangelogPost changelog={changelog as Changelog} />
                </div>
              ))}
          </div>
        </div>
      </div>
      <HomeFooter />
    </main>
  );
}
