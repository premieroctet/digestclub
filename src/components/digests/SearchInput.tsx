'use client';

import { InputHTMLAttributes, useCallback, useTransition } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { AiOutlineLoading3Quarters as LoadingIcon } from '@react-icons/all-files/ai/AiOutlineLoading3Quarters';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import debounce from 'lodash/debounce';

const SearchInput = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  const searchParams = useSearchParams()!;
  const path = usePathname();
  const { replace } = useRouter();
  let [isPending, startTransition] = useTransition();

  /* eslint-disable react-hooks/exhaustive-deps */
  const onSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('search', e.target.value);

      startTransition(() => {
        replace(path + `?${params.toString()}`);
      });
    }, 600),
    []
  );

  return (
    <div className={className}>
      <div className="mt-2 flex rounded-md shadow-sm">
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {isPending ? (
              <LoadingIcon
                className="animate-spin h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            ) : (
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            )}
          </div>
          <input
            type="search"
            name="search"
            id="search"
            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Search bookmarks"
            onInput={onSearch}
            defaultValue={searchParams?.get('search') || ''}
            autoFocus
            {...props}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
