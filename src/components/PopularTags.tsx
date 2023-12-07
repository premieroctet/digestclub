import React from 'react';
import Tag, { ITag } from './Tag';
import Link from 'next/link';
import { TagPayload } from '@prisma/client';

interface Props {
  tags: ITag[];
  currentTag?: ITag;
}

export default function PopularTags({ tags, currentTag }: Props) {
  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg">
      <h4 className="text-xl font-bold">Popular tags</h4>
      <div className="flex gap-4 mt-4">
        {tags.map(({ id, name, slug, description }) => (
          <Link key={id} href={`/tags/${slug}`}>
            <div className="flex flex-col items-start gap-2">
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
