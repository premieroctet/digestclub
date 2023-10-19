'use client';
import clsx from 'clsx';

const Logo = (props: { className?: string }) => {
  return (
    <div className="flex items-center cursor-pointer">
      <div className="w-8 h-8 xs:w-4 xs:h-4 rounded-full bg-gradient-to-tl from-[#DEFFF0] to-[#89FFCB] bg-[#89FFCB] sm:mt-1" />
      <span
        className={clsx(
          ` ml-2 text-xl font-[800] text-gray-900 max-xs:hidden`,
          props.className
        )}
      >
        digest.club
      </span>
    </div>
  );
};

export default Logo;
