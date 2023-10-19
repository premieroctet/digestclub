'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { HTMLProps, useEffect, useState, useTransition } from 'react';

type Props = {
  totalItems: number;
  itemsPerPage?: number;
};

const Pagination = ({
  totalItems,
  itemsPerPage = 10,
  className,
  ...props
}: Props & HTMLProps<HTMLDivElement>) => {
  const { push } = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams()!;
  const [isRefreshing, startTransition] = useTransition();
  const [action, setAction] = useState<'prev' | 'next'>();

  const currentPage = Number(searchParams?.get('page')) || 1;

  const totalPages =
    totalItems < itemsPerPage ? 1 : Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());

    startTransition(() => {
      push(path + `?${params.toString()}`);
    });
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      handlePageChange(totalPages);
    }
  });

  if (totalPages < 2) {
    return null;
  }

  return (
    <div className={clsx('h-8', className)} {...props}>
      <nav
        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
        aria-label="Pagination"
      >
        <div
          onClick={() => {
            setAction('prev');
            handlePageChange(currentPage - 1);
          }}
          className={clsx(
            'cursor-pointer w-8 relative inline-flex items-center rounded-l-md p-[10%] text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 bg-white',
            {
              'cursor-not-allowed opacity-30 pointer-events-none':
                currentPage === 1 || isRefreshing,
            }
          )}
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-full w-full" aria-hidden="true" />
        </div>
        <div className="relative inline-flex items-center text-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0">
          <span>{currentPage}</span>
        </div>
        <div
          onClick={() => {
            setAction('next');
            handlePageChange(currentPage + 1);
          }}
          className={clsx(
            'cursor-pointer w-8 relative inline-flex items-center rounded-r-md p-[10%] text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 bg-white',
            {
              'cursor-not-allowed opacity-30 pointer-events-none':
                currentPage === totalPages || isRefreshing,
            }
          )}
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="h-full w-full" aria-hidden="true" />
        </div>
      </nav>
    </div>
  );
};

export default Pagination;
