import Tag, { ITag } from '@/components/Tag';
import BookmarkImage, {
  Props as BookmarkImageProps,
} from '@/components/bookmark/BookmarkImage';
import { getEnvHost } from '@/lib/server';
import { getDomainFromUrl } from '@/utils/url';
import { ChartBarIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

function CardStyleBlock({
  bookmarkId,
  bookmarkLink,
  title,
  description,
  url,
  panelSlot,
  onClick,
  views,
  tags,
}: {
  bookmarkId: string;
  bookmarkLink: BookmarkImageProps['link'];
  title?: string;
  description?: string;
  url: string;
  panelSlot: React.ReactNode;
  onClick: () => void;
  views?: number;
  tags: ITag[];
}) {
  const hasPanel = Boolean(panelSlot);

  return (
    <div className="group relative flex w-full overflow-hidden py-1 max-md:flex-col">
      <a
        href={url}
        className="flex w-full overflow-hidden"
        rel="noopener noreferrer"
        target="_blank"
        onClick={onClick}
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
              {typeof views !== 'undefined' && views > 0 && (
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <div className="flex items-center">
                    <ChartBarIcon className="text-gray-400 h-4 w-4 mr-1" />{' '}
                    {`${views} view${views > 1 ? 's' : ''}`}
                  </div>
                </div>
              )}
            </div>
            <div className="w-full md:w-2/3 md:mt-0 max-w-[100%]">
              <p className="text-lg font-semibold overflow-hidden text-ellipsis leading-6 bg-green-50 group-hover:bg-green-100 transition-colors inline">
                {title}
              </p>
              {Boolean(description) && (
                <p className={clsx('text-sm mt-1', hasPanel && 'line-clamp-2')}>
                  {description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 items-center mt-1">
                <p className="text-sm  text-slate-400">
                  {getDomainFromUrl(url)}
                </p>
                <ul className="flex gap-2 items-center">
                  {tags.map((tag) => (
                    <li key={tag.id}>
                      <Tag tag={tag} size="small" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        </div>
      </a>
      {hasPanel && panelSlot}
    </div>
  );
}

export default CardStyleBlock;
