import { PropsWithChildren, useState } from 'react';
import Pagination from '../list/Pagination';
import clsx from 'clsx';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { Switch } from '../Input';

export const BookmarksListControls = ({
  linkCount,
}: { linkCount: number } & PropsWithChildren) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString());
  const path = usePathname();
  let [isPending, startTransition] = useTransition();
  const { replace } = useRouter();

  const handleCheckboxChange = () => {
    if (!searchParams) return;

    if (params.get('all') === 'true') {
      params.delete('all');
    } else {
      params.set('all', 'true');
      params.delete('page');
    }
    startTransition(() => {
      replace(path + `?${params.toString()}`);
    });
  };

  if (params?.get('search') && !linkCount) return null;

  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full max-sm:justify-between">
      <Switch
        label="View all bookmarks"
        onClick={handleCheckboxChange}
        checked={searchParams?.has('all')}
      />
      <Pagination totalItems={linkCount} className="h-6" />
    </div>
  );
};
