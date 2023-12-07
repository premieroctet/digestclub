import React from 'react';
import Tag, { ITag } from './Tag';
import Link from 'next/link';

interface Props {
  tags: ITag[];
  currentTag?: ITag;
}

export default function PopularTags({ tags, currentTag }: Props) {
  if (tags.length === 0) return <></>;
  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg">
      <h4 className="text-xl font-bold">Popular tags</h4>
      <p className="text-xs text-slate-500 mt-0.5">
        Browse digests by the most used tags
      </p>
      <div className="flex gap-2 mt-4 flex-wrap">
        {tags.map(({ id, name, slug, description }) => (
          <Link key={id} href={`/tags/${slug}`}>
            <div className="flex flex-col items-start gap-&">
              <Tag
                tag={{
                  id,
                  name,
                  slug,
                  description,
                }}
                size="default"
                active={currentTag?.id === id}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
