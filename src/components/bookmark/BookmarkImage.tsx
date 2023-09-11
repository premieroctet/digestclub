import { BookmarkIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import React, { useState } from 'react';
import * as Sentry from '@sentry/nextjs';

export interface Props {
  link: { image: string | null; blurHash: string | null; title: string | null };
  fallbackSrc?: string;
}

const BookmarkImage = ({ link, fallbackSrc }: Props) => {
  const [failToLoadImage, setFailToLoadImage] = useState(false);

  return (
    <>
      {failToLoadImage ? (
        <div className="flex items-center justify-center bg-gray-100 text-gray-200 h-full w-full">
          <BookmarkIcon className="h-10 w-10" />
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
