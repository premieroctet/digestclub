'use client';

import { isPdfUrl } from '@/utils/url';
import { BookmarkIcon, DocumentIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useState } from 'react';

export interface Props {
  link: {
    image: string | null;
    blurHash: string | null;
    title: string | null;
    url: string;
  };
  fallbackSrc?: string;
}

const PdfIcon = () => {
  return (
    <div className="flex flex-col justify-center">
      <span className="text-center text-white font-bold text-xs absolute mt-2 ml-2">
        PDF
      </span>
      <DocumentIcon className="h-10 w-10 fill-violet-600" />
    </div>
  );
};

const BookmarkImage = ({ link, fallbackSrc }: Props) => {
  const [failToLoadImage, setFailToLoadImage] = useState(false);
  const isPdf = isPdfUrl(link.url);

  return (
    <>
      {failToLoadImage ? (
        <div className="flex items-center justify-center bg-gray-100 text-gray-200 h-full w-full">
          {isPdf ? <PdfIcon /> : <BookmarkIcon className="h-10 w-10" />}
        </div>
      ) : (
        <Image
          fill
          className="object-cover z-10 relative"
          placeholder="blur"
          referrerPolicy="no-referrer"
          unoptimized
          blurDataURL={link.blurHash || 'placeholder'}
          alt={link.title!}
          title={link.title!}
          src={link.image || fallbackSrc || ''}
          onError={({ currentTarget }) => {
            /* On error we will try to load a fallbackSrc if provided */
            if (!fallbackSrc) {
              /* If no fallbackSrc is provided we will consider the image as failed to load */
              setFailToLoadImage(true);
            } else if (currentTarget.src !== fallbackSrc && !failToLoadImage) {
              /* If the image failed to load and we have a fallbackSrc we will try to load it */
              currentTarget.src = fallbackSrc!;
            } else {
              /* If the fallbackSrc also failed to load we will consider the image as failed to load */
              setFailToLoadImage(true);
            }
          }}
        />
      )}
    </>
  );
};

export default BookmarkImage;
