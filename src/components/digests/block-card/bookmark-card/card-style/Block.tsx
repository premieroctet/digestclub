import BookmarkImage, {
  Props as BookmarkImageProps,
} from '@/components/bookmark/BookmarkImage';
import { getEnvHost } from '@/lib/server';
import { getDomainFromUrl } from '@/utils/url';
import clsx from 'clsx';

function CardStyleBlock({
  bookmarkId,
  bookmarkLink,
  title,
  description,
  url,
  panelSlot,
}: {
  bookmarkId: string;
  bookmarkLink: BookmarkImageProps['link'];
  title?: string;
  description?: string;
  url: string;
  panelSlot: React.ReactNode;
}) {
  const hasPanel = Boolean(panelSlot);

  return (
    <div className="group relative flex w-full overflow-hidden py-1 max-md:flex-col">
      <a
        href={url}
        className="flex w-full overflow-hidden"
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className="flex-1 flex flex-col md:flex-row max-w-[100%] gap-7">
          <>
            <div className="w-full md:w-1/3">
              <div className="overflow-hidden border rounded-lg aspect-video full relative">
                <BookmarkImage
                  link={bookmarkLink}
                  fallbackSrc={`${getEnvHost()}/api/bookmark-og?bookmark=${bookmarkId}`}
                />
              </div>
            </div>
            <div className="w-full md:w-2/3 md:mt-0 max-w-[100%]">
              <p className="text-lg font-semibold overflow-hidden text-ellipsis leading-6 bg-green-50 group-hover:bg-green-100 transition-colors inline pl-2 pr-2 py-1">
                {title}
              </p>
              {Boolean(description) && (
                <p className={clsx('text-sm mt-1', hasPanel && 'line-clamp-2')}>
                  {description}
                </p>
              )}
              <p className="text-sm mt-1 text-slate-400">
                {getDomainFromUrl(url)}
              </p>
            </div>
          </>
        </div>
      </a>
      {hasPanel && panelSlot}
    </div>
  );
}

export default CardStyleBlock;
