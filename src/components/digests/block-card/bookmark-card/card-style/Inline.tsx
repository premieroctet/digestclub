import { getDomainFromUrl } from '@/utils/url';
import clsx from 'clsx';

function CardStyleInline({
  title,
  description,
  url,
  panelSlot,
}: {
  title?: string;
  description?: string;
  url: string;
  panelSlot: React.ReactNode;
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
            <p className="text-sm mt-1 text-slate-400">
              {getDomainFromUrl(url)}
            </p>
          </div>
        </div>
      </a>
      {hasPanel && panelSlot}
    </div>
  );
}

export default CardStyleInline;
