import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import React, { useState } from 'react';
import Button from '../Button';

interface Props {
  onEditClick?: () => void;
  onRemoveClick: () => void;
  onAddTextBlockClick?: () => void;
  isRemoving?: boolean;
}
export default function ActionsBlockPopover({
  onEditClick,
  onRemoveClick,
  onAddTextBlockClick,
  isRemoving = false,
}: Props) {
  const [open, setOpen] = useState(false);
  function close() {
    setOpen(false);
  }
  return (
    <Popover.Root open={open} onOpenChange={() => setOpen(!open)}>
      <div className="flex justify-center items-center gap-2 top-2 right-1 absolute md:relative cursor-pointer">
        <Popover.Trigger asChild className="relative">
          <EllipsisVerticalIcon className="max-md:fill-white max-md:isolate w-5 h-5 " />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <div className="text-sm flex mt-3 items-center justify-between space-x-8 border rounded-md bg-white p-2 text-gray-700 shadow-lg top-0 right-0 z-50">
              <div className="flex flex-col gap-2 py bg-white">
                {onEditClick && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      close();
                      onEditClick();
                    }}
                    disabled={isRemoving}
                  >
                    Edit
                  </Button>
                )}
                {onAddTextBlockClick && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      close();
                      onAddTextBlockClick();
                    }}
                    disabled={isRemoving}
                  >
                    Add text block after
                  </Button>
                )}
                {onRemoveClick && (
                  <Button
                    variant="destructiveGhost"
                    size="sm"
                    isLoading={isRemoving}
                    onClick={(e) => {
                      e.preventDefault();
                      onRemoveClick();
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </div>
    </Popover.Root>
  );
}
