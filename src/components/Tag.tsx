import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Tag as TagModel } from '@prisma/client';

export type ITag = Pick<TagModel, 'id' | 'name' | 'slug' | 'description'>;

const Tag = ({
  tag,
  onCloseClick,
  size = 'default',
  active = false,
}: {
  tag: ITag;
  onCloseClick?: (tag: ITag) => void;
  size?: 'default' | 'small' | 'large';
  active?: boolean;
}) => {
  return (
    <div
      key={tag.id}
      className={clsx(
        'flex items-center justify-center rounded-md bg-gray-50 font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10',
        {
          'text-xs px-2 py-1': size === 'default',
          'text-[11px] px-2 py-0.5': size === 'small',
          'text-lg px-6 py-3': size === 'large',
          'bg-violet-50 text-violet-700 ring-violet-700/10': active,
        }
      )}
    >
      <span className="leading-1">#{tag.name}</span>
      {onCloseClick && (
        <XMarkIcon
          className="m-auto ml-1 w-3 h-3 cursor-pointer"
          onClick={() => onCloseClick(tag)}
        />
      )}
    </div>
  );
};

export default Tag;
