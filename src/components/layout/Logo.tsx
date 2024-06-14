'use client';
import clsx from 'clsx';
import BrandIcon from './BrandIcon';

const Logo = (props: { className?: string; isWhite?: boolean }) => {
  return (
    <span className={clsx('flex items-center cursor-pointer gap-2')}>
      <BrandIcon
        fill={
          process.env.NODE_ENV === 'development'
            ? 'red'
            : props.isWhite
            ? 'white'
            : 'black'
        }
      />

      <span
        className={clsx(`text-xl font-[800] `, props.className, {
          'text-red-600': process.env.NODE_ENV === 'development',
          'text-gray-900': process.env.NODE_ENV !== 'development',
        })}
      >
        digest.club
      </span>
    </span>
  );
};

export default Logo;
