'use client';

import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import screenshotBuilder from '@/images/screenshots/builder.png';
import screenshotDigest from '@/images/screenshots/digest.png';
import screenshotDiscover from '@/images/screenshots/discover.png';
import screenshotList from '@/images/screenshots/list.png';
import Section from './Section';

const features = [
  {
    title: 'Collect Links',
    description: `Gather your team's links in one place with our webapp or through the seamless Slack integration.`,
    image: screenshotList,
  },
  {
    title: 'Build your Digest',
    description:
      'Craft customized digests by selecting top links and enhance them with markdown content and AI summarization.',
    image: screenshotBuilder,
  },
  {
    title: 'Share it',
    description:
      'Share your digests using the public link or through the in-app newsletter feature.',
    image: screenshotDigest,
  },
  {
    title: 'Discover Digests',
    description: 'Explore digests from other teams to dig up relevant content.',
    image: screenshotDiscover,
  },
];

export default function PrimaryFeatures() {
  let [tabOrientation, setTabOrientation] = useState<'horizontal' | 'vertical'>(
    'horizontal'
  );

  useEffect(() => {
    let lgMediaQuery = window.matchMedia('(min-width: 1024px)');

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? 'vertical' : 'horizontal');
    }

    onMediaQueryChange(lgMediaQuery);
    lgMediaQuery.addEventListener('change', onMediaQueryChange);

    return () => {
      lgMediaQuery.removeEventListener('change', onMediaQueryChange);
    };
  }, []);

  return (
    <Section
      title="The Digest.club Features"
      caption="Discover the features that make Digest.club the best tool for your team."
      className="relative overflow-hidden py-24 sm:py-26 w-full"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Tab.Group
          as="div"
          className="grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === 'vertical'}
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <Tab.List className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className={clsx(
                        'group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6',
                        selectedIndex === featureIndex
                          ? 'bg-red bg-purple-400/10 ring-1 lg:ring-inset ring-purple-800/10'
                          : 'hover:bg-purple-400/10 lg:hover:bg-purple-400/5'
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            'font-display text-lg outline-none font-semibold lg:font-bold',
                            selectedIndex === featureIndex
                              ? 'text-black lg:text-black'
                              : 'text-black hover:text-black lg:text-black'
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                          {feature.title}
                        </Tab>
                      </h3>
                      <p
                        className={clsx(
                          'mt-2 hidden text-sm lg:block',
                          selectedIndex === featureIndex
                            ? 'text-black'
                            : 'text-slate-700 group-hover:text-black'
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </Tab.List>
              </div>
              <Tab.Panels className="lg:col-span-7">
                {features.map((feature) => (
                  <Tab.Panel key={feature.title} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl" />
                      <p className="relative mx-auto max-w-2xl text-base text-slate-700 text-center">
                        {feature.description}
                      </p>
                    </div>
                    <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                      <Image
                        quality={100}
                        className="w-full"
                        src={feature.image}
                        alt=""
                        priority
                        sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                      />
                    </div>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </>
          )}
        </Tab.Group>
      </div>
    </Section>
  );
}
