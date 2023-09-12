import { PropsWithChildren } from 'react';
import Pagination from '../list/Pagination';
import clsx from 'clsx';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';

export const BookmarksControls = ({
  linkCount,
}: { linkCount: number } & PropsWithChildren) => {
  const searchParams = useSearchParams();
  const path = usePathname();
  let [isPending, startTransition] = useTransition();
  const { replace } = useRouter();

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        title="Show unused bookmarks"
        className={clsx(
          'm-1 relative top-[2px] inline-flex items-center rounded-full border py-1 px-3 text-sm font-bold cursor-pointer transition ease-in-out duration-150 focus:outline-none',
          searchParams?.get('all') === 'true' &&
            'bg-gray-900 text-white border-black',
          searchParams?.get('all') !== 'false' && 'opacity-40 hover:opacity-100'
        )}
        onClick={() => {
          if (!searchParams) return;
          const params = new URLSearchParams(searchParams);
          if (params.get('all') === 'true') {
            params.delete('all');
          } else {
            params.set('all', 'true');
          }
          startTransition(() => {
            replace(path + `?${params.toString()}`);
          });
        }}
      >
        All bookmarks
      </button>
      <Pagination totalItems={linkCount} className="h-6" />
    </div>
  );
};
