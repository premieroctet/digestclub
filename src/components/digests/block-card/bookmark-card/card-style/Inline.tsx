import Tag, { ITag } from '@/components/Tag';
import { getDomainFromUrl } from '@/utils/url';
import { ChartBarIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

function CardStyleInline({
  title,
  description,
  url,
  panelSlot,
  onClick,
  views,
  tags,
}: {
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
    <div
      className={clsx(
        'group relative flex w-full overflow-hidden py-1',
        'max-md:flex-row'
      )}
    >
      <a
        href={url}
        className="flex w-full overflow-hidden"
        rel="noopener noreferrer"
        target="_blank"
        onClick={onClick}
      >
        <div
          className={clsx(
            'flex-1 flex flex-col md:flex-row max-w-[100%] gap-7'
          )}
        >
          <div className={clsx('w-full max-w-[100%]')}>
            <p className={clsx('w-full ', hasPanel && 'line-clamp-3')}>
              <span className="text-lg font-semibold bg-green-50 group-hover:bg-green-100 transition-colors inline pl-2 pr-2 py-1">
                {title}
              </span>
              {Boolean(description) && (
                <span className="text-sm">{` — ${description}`}</span>
              )}
            </p>
            <div className="flex flex-wrap gap-2 items-center mt-1">
              <p className="text-sm mt-1 text-slate-400">
                {getDomainFromUrl(url)}
              </p>
              {tags.length > 0 && (
                <ul className="flex gap-2 items-center">
                  {tags.map((tag) => (
                    <li key={tag.id}>
                      <Tag tag={tag} size="small" />
                    </li>
                  ))}
                </ul>
              )}
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
        </div>
      </a>
      {hasPanel && panelSlot}
    </div>
  );
}

export default CardStyleInline;
