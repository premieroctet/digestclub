import React, { HTMLProps, forwardRef, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useQuery } from 'react-query';
import api from '@/lib/api';
import Tag, { ITag } from './Tag';

const TagsInput = forwardRef<
  HTMLInputElement,
  HTMLProps<HTMLInputElement> & {
    tags: ITag[];
    onTagCloseClick?: (tag: ITag) => void;
  }
>(function Input({ className, tags, onTagCloseClick, ...props }, ref) {
  return (
    <div
      className={clsx(
        'px-3 flex gap-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 disabled:ring-gray-200 disabled:shadow-none',
        className
      )}
    >
      {tags.length > 0 && (
        <div className="flex items-center gap-2">
          {tags.map((tag) => (
            <Tag
              key={tag.id}
              tag={tag}
              onCloseClick={() => onTagCloseClick?.(tag)}
            />
          ))}
        </div>
      )}
      <input
        className="border-red-400 border-none outline-none focus:outline-none focus:ring-0 p-0"
        ref={ref}
        {...props}
      />
    </div>
  );
});

export default function TagsSelect({
  value,
  onChange,
  maxTags = 2,
}: {
  value: ITag[];
  onChange: (tags: ITag[]) => void;
  maxTags?: number;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [hasMaxTags, setHasMaxTags] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  function filteredTags(tags: ITag[], search: string) {
    return tags
      .filter((tag) => tag.name.toLowerCase().includes(search.toLowerCase()))
      .filter((tag) => !value.find((t) => t.id === tag.id));
  }

  const {
    data: data,
    isLoading,
    isFetched,
  } = useQuery('tags', async () => {
    const response = await api.get('/tags');
    return response.data;
  });

  const hasLoadedTags = isFetched && !isLoading && data && data.tags.length > 0;

  useEffect(() => {
    if (value.length === maxTags) {
      setHasMaxTags(true);
    } else if (value.length < maxTags && hasMaxTags) {
      setHasMaxTags(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (inputRef.current && hasMaxTags) {
      inputRef.current.blur();
    }
  }, [hasMaxTags]);

  return (
    <fieldset
      className="flex flex-col w-full relative"
      onClick={() => {
        inputRef.current?.focus();
      }}
    >
      <label htmlFor="title" className="mb-2">
        Tags <span className="text-sm">{'- max. 2 tags'}</span>
      </label>
      <div>
        <TagsInput
          type="text"
          tags={value}
          value={search}
          className={clsx(isListOpen && 'rounded-b-none')}
          onChange={(e) => {
            // @ts-expect-error
            setSearch(e.target.value);
          }}
          ref={inputRef}
          onTagCloseClick={(tag) => {
            onChange(value.filter((t) => t.id !== tag.id));
          }}
          onFocus={() => {
            setIsListOpen(true);
          }}
          disabled={hasMaxTags}
        />
      </div>

      {!hasMaxTags && isListOpen && (
        <SelectList
          isLoading={isLoading}
          list={hasLoadedTags ? filteredTags(data.tags, search) : undefined}
          onTagClick={(tag) => {
            onChange([...value, tag]);
            setSearch('');
          }}
        />
      )}
    </fieldset>
  );
}

const SelectList = ({
  isLoading,
  list,
  onTagClick,
}: {
  isLoading: boolean;
  list?: ITag[];
  onTagClick: (tag: ITag) => void;
}) => {
  const noTagsFound = list && list.length === 0;
  return (
    <div
      className={clsx(
        'h-40 overflow-y-scroll border-neutral-200 border border-t-0 pt-2 px-3',
        { 'h-auto': noTagsFound || isLoading }
      )}
    >
      {isLoading && (
        <div className="text-sm py-2 text-neutral-500">Loading tags...</div>
      )}
      {list && (
        <>
          {noTagsFound ? (
            <div className="text-sm py-2 text-neutral-500">No tags found</div>
          ) : (
            <ul className="flex flex-wrap gap-2 gap-y-2">
              {list.map((tag) => (
                <li
                  key={tag.id}
                  className=""
                  onClick={() => {
                    onTagClick(tag);
                  }}
                >
                  <Tag tag={tag} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};
