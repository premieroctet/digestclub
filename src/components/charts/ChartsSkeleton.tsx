import React from 'react';

export default function ChartsSkeleton() {
  return (
    <div className="h-[60px] w-full">
      <div className="w-[60px] h-full rounded-sm flex flex-col justify-end">
        <div className="w-full h-[36px]"></div>
        <div className="w-full h-[16px"></div>
      </div>
      <div className="w-full h-full  bg-gradient-to-r from-transparent via-gray-700/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
    </div>
  );
}
