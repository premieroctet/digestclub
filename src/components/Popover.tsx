import {
  Content,
  PopoverProps,
  Portal,
  Root,
  Trigger,
} from '@radix-ui/react-popover';
import { ReactElement, cloneElement, forwardRef } from 'react';
import Button from './Button';

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
            <div className="text-sm flex mt-3 items-center justify-between space-x-8 border rounded-md bg-white p-2 text-gray-700 shadow-lg">
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
            <span ref={ref} className="text-xs font-semibold hover:underline">
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
