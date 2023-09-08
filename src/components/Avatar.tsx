import Image from 'next/image';
import React from 'react';

interface IProps {
  size: 'xs' | 'sm' | 'md' | 'lg';
  name?: string;
  src?: string;
}

export default function Avatar({ size = 'md', src, name }: IProps) {
  const sizeClass: Record<IProps['size'], string> = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const sizePixels: Record<IProps['size'], number> = {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 10,
  };

  if (src !== undefined) {
    return (
      <Image
        className={`inline-block rounded-full ${sizeClass[size]}`}
        src={src}
        width={sizePixels[size]}
        height={sizePixels[size]}
        alt="avatar"
      />
    );
  }

  if (name !== undefined) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full bg-violet-500 ${sizeClass[size]}`}
      >
        <span className="text-xs font-medium leading-none text-white uppercase">
          {name
            .split(' ')
            .splice(0, 2)
            .map((n) => n[0])
            .join('')}
        </span>
      </span>
    );
  }

  return (
    <span
      className={`inline-block overflow-hidden rounded-full bg-violet-100 ${sizeClass[size]}`}
    >
      <svg
        className="h-full w-full text-violet-500"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </span>
  );
}
