import React from 'react';
import { DocumentCheckIcon } from '@heroicons/react/24/solid';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

interface Props {
  href: string;
  relativeDate: string;
}
export default function DigestEditVisit({ href, relativeDate }: Props) {
  return (
    <div className="group relative flex items-start space-x-3 content-center overflow-hidden rounded-lg bg-white px-4 py-4 shadow-md sm:px-4 sm:py-4">
      <div className="flex items-center justify-center m-auto h-10 w-10  bg-emerald-400 text-white rounded-lg">
        <span className="inline-flex h-6 w-6 items-center justify-center m-auto animate-in duration-200 delay-500 fade-in zoom-in-50 fill-mode-both">
          <DocumentCheckIcon />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-gray-900">
          <Link href={href} target="_blank">
            <span
              className="absolute inset-0 cursor-pointer z-10"
              aria-hidden="true"
            />
            View digest
          </Link>
        </div>
        <p className="text-sm text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
          <span>Published about {relativeDate}</span>
        </p>
      </div>
      <div className="flex-shrink-0 self-center group-hover:translate-x-1 -translate-x-1 transition-all duration-200">
        <ChevronRightIcon
          className="h-5 w-5 text-gray-400 -z-10"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
