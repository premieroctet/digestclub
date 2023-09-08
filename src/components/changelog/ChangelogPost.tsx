import { getEnvHost } from '@/lib/server';
import { Changelog } from 'contentlayer/generated';
import Image from 'next/image';
import React from 'react';

interface Props {
  changelog: Changelog;
}

export default function ChangelogPost({
  changelog: { title, body, publishedAt, image },
}: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
  };

  return (
    <article className="prose prose-violet prose-lg w-full gap-6 md:gap-0 flex flex-col md:grid md:grid-cols-12 mt-7 max-w-none prose-h1:text-2xl prose-h1:font-black prose-blockquote:border-l-violet-400 prose-code:text-violet-400 prose-code:bg-inherit">
      <aside className="xl:col-span-4 md:col-span-3 p-1">
        <time
          dateTime={publishedAt}
          className="flex items-center text-sm md:text-base text-gray-400"
        >
          {formatDate(publishedAt)}
        </time>
      </aside>
      <main className="xl:col-span-8 col-span-9 flex flex-col justify-start items-start ">
        {image && (
          <div className="relative w-full mb-8 h-[400px]">
            <Image
              src={`/changelogs/${image}`}
              alt={title}
              width={1200}
              height={400}
              className="mt-0"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}
        <h2 className="my-auto m-r-auto font-bold tracking-tight text-gray-800 md:text-4xl overflow-hidden text-ellipsis leading-6 bg-green-50 group-hover:bg-green-100 transition-colors inline py-1 px-2">
          {title}
        </h2>
        <div
          className="mt-6 text-sm [&>*]:mb-3 [&>*:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: body.html }}
        />
      </main>
    </article>
  );
}
