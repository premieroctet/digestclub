import {
  Content,
  PopoverProps,
  Portal,
  Root,
  Trigger,
} from '@radix-ui/react-popover';
import { ReactElement, cloneElement, forwardRef } from 'react';
import Button from './Button';
import { getContributor } from './bookmark/BookmarkItem';
import { TrashIcon } from '@heroicons/react/24/solid';
import { TeamBookmarkedLinkItem } from '@/services/database/link';

interface DeletePopoverProps {
  trigger?: ReactElement;
  handleDelete: () => void;
  isLoading: boolean;
}

interface IProps {
  trigger: ReactElement;
}

export const Popover = forwardRef<HTMLButtonElement, PopoverProps & IProps>(
  function Popover({ trigger, children, ...popoverProps }, ref) {
    return (
      <Root {...popoverProps}>
        <Trigger asChild className="relative">
          {cloneElement(trigger, {
            ref,
          })}
        </Trigger>
        <Portal>
          <Content>
            <div className="text-sm flex mt-3 items-center justify-between space-x-8 border rounded-md bg-white p-2 text-gray-700 shadow-lg z-50">
              {children}
            </div>
          </Content>
        </Portal>
      </Root>
    );
  }
);

export const DeletePopover = forwardRef<HTMLButtonElement, DeletePopoverProps>(
  function DeletePopover(props, ref) {
    return (
      <Popover
        trigger={
          props.trigger || (
            <span
              ref={ref}
              className="text-xs font-semibold hover:underline cursor-pointer"
            >
              Delete
            </span>
          )
        }
      >
        <>
          <span className="font-medium">
            Are <b>you sure?</b>
          </span>
          <span>
            <Button
              variant="destructiveOutline"
              size="sm"
              onClick={props.handleDelete}
              isLoading={props.isLoading}
            >
              Yes, delete it
            </Button>
          </span>
        </>
      </Popover>
    );
  }
);

DeletePopover.displayName = 'DeletePopover';

export const MultipleDeletePopover = forwardRef<
  HTMLButtonElement,
  {
    onDelete: (bookmarkId: string) => void;
    bookmarks: TeamBookmarkedLinkItem['bookmark'];
    trigger?: ReactElement;
    isLoading: boolean;
  }
>(function MultipleDeletePopover(props, ref) {
  const { bookmarks, onDelete, isLoading } = props;

  return (
    <Popover
      trigger={
        props.trigger || (
          <span
            ref={ref}
            className="text-xs font-semibold hover:underline cursor-pointer"
          >
            Delete
          </span>
        )
      }
    >
      <div className="flex-col z-20">
        {bookmarks.map((bookmark) => (
          <div className="flex items-center justify-between" key={bookmark?.id}>
            <div className="pr-4">{getContributor(bookmark)}</div>
            <DeletePopover
              handleDelete={() => onDelete(bookmark?.id)}
              isLoading={isLoading}
              trigger={
                <Button
                  aria-label="Delete digest"
                  icon={<TrashIcon />}
                  variant="destructiveGhost"
                  isLoading={isLoading}
                />
              }
            />
          </div>
        ))}
      </div>
    </Popover>
  );
});

MultipleDeletePopover.displayName = 'MultipleDeletePopover';
