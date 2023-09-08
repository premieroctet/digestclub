import React, { FC } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { XMarkIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

export const Dialog: FC<RadixDialog.DialogProps> = ({ children, ...props }) => (
  <RadixDialog.Root {...props}>{children}</RadixDialog.Root>
);

interface DialogContentProps extends RadixDialog.DialogContentProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  closeIcon?: boolean;
}

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(({ children, className = '', containerClassName, ...props }, ref) => (
  <RadixDialog.Portal>
    <RadixDialog.Overlay className="fixed z-[101] top-0 left-0 right-0 bottom-0 bg-black opacity-30 animate-in duration-150 fade-in" />
    <RadixDialog.Content
      className="fixed z-[102] top-0 left-0 right-0 bottom-0 overflow-auto w-full animate-in fade-in slide-in-from-bottom-10 duration-300 delay-150 fill-mode-both"
      {...props}
      ref={ref}
      style={{ pointerEvents: 'none' }}
    >
      <div className="flex min-h-full justify-center items-center p-4 text-center sm:p-0">
        <div
          style={{
            pointerEvents: 'all',
          }}
          className={clsx(
            'relative transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all pointer-events-auto',
            containerClassName
          )}
        >
          <div className="sm:flex sm:items-start w-full">
            <div className="text-center sm:text-left w-full">
              <div className="w-full flex justify-between">
                {props.title && (
                  <RadixDialog.Title
                    className="text-2xl leading-6 text-gray-900"
                    id="modal-title"
                  >
                    {props.title}
                  </RadixDialog.Title>
                )}
                {props.closeIcon && (
                  <RadixDialog.Close>
                    <XMarkIcon className="h-6 w-6" />
                  </RadixDialog.Close>
                )}
              </div>
              {props.description && (
                <RadixDialog.Description className="mt-2 text-base text-gray-500 italic">
                  {props.description}
                </RadixDialog.Description>
              )}
            </div>
          </div>
          {children && (
            <div className={clsx('mt-5 sm:mt-4 flex w-full', className)}>
              {children}
            </div>
          )}
        </div>
      </div>
    </RadixDialog.Content>
  </RadixDialog.Portal>
));

DialogContent.displayName = 'DialogContent';

export const DialogTrigger = RadixDialog.Trigger;
