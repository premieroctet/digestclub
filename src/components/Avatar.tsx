import cn from 'classnames';
import Image from 'next/image';
import { useState } from 'react';

interface IProps {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  name?: string;
  src?: string;
}

export default function Avatar({ size = 'md', src, name }: IProps) {
  const [isImageError, setIsImageError] = useState(false);
  const sizeClass: Record<IProps['size'], string> = {
    'xs': 'h-4 w-4' /* 16px */,
    'sm': 'h-6 w-6' /* 24px */,
    'md': 'h-8 w-8' /* 32px */,
    'lg': 'h-10 w-10' /* 40px */,
    'xl': 'h-16 w-16' /* 64px */,
    '2xl': 'h-32 w-32' /* 128px */,
  };

  const sizePixels: Record<IProps['size'], number> = {
    'xs': 16,
    'sm': 24,
    'md': 32,
    'lg': 40,
    'xl': 64,
    '2xl': 128,
  };

  if (src !== undefined && !isImageError) {
    return (
      <Image
        className={`inline-block rounded-full ${sizeClass[size]}`}
        src={src}
        quality={100}
        width={sizePixels[size]}
        height={sizePixels[size]}
        alt="avatar"
        onError={(e) => {
          setIsImageError(true);
        }}
      />
    );
  }

  if (name !== undefined) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full bg-violet-500 ${sizeClass[size]}`}
      >
        <span
          className={cn(' font-medium leading-none text-white uppercase', {
            'text-xs': ['xs', 'sm'].includes(size),
            'text-sm': size === 'md',
            'text-base': size === 'lg',
            'text-xl': size === 'xl',
            'text-4xl': size === '2xl',
          })}
        >
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
