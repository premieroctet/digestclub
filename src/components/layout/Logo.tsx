'use client';
import clsx from 'clsx';
import BrandIcon from './BrandIcon';

const Logo = (props: { className?: string; isWhite?: boolean }) => {
  return (
    <div className="flex items-center cursor-pointer gap-2">
      <BrandIcon fill={props.isWhite ? 'white' : 'black'} />
      <span
        className={clsx(`text-xl font-[800] text-gray-900`, props.className)}
      >
        digest.club
      </span>
    </div>
  );
};

export default Logo;
