'use client';

import { AiOutlineLoading3Quarters as LoadingIcon } from '@react-icons/all-files/ai/AiOutlineLoading3Quarters';
import { VariantProps, cva } from 'class-variance-authority';
import clsx from 'clsx';
import React, { forwardRef } from 'react';

const buttonVariants = cva(
  'rounded-md font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 flex items-center justify-center gap-2 cursor-pointer box-content',
  {
    variants: {
      variant: {
        default: 'shadow-sm bg-violet-600 hover:bg-violet-700 text-white',
        outline:
          'border border-1 shadow-sm bg-transparent hover:bg-violet-700 text-violet-700 border-violet-600 hover:text-white box-border',
        destructive:
          'border-1 shadow-sm bg-red-700 hover:bg-red-600 text-white border-red-700',
        destructiveOutline:
          'border-1 shadow-sm bg-transparent hover:bg-red-700 text-red-700 border-1 border-red-700 hover:bg-red-100 hover:text-white',
        success:
          'border-1 shadow-sm bg-[#4ade80] hover:bg-[#3dba6b] text-white border-[#4ade80] hover:border-[#3dba6b]',
        ghost:
          'bg-transparent text-violet-700 border-1 border-transparent hover:bg-violet-100 hover:border-violet-100',
        destructiveGhost:
          'bg-transparent text-red-700 border-1 border-transparent hover:bg-red-100 hover:border-red-100',
        link: 'border-0 text-gray-700 text-sm underline hover:text-gray-400 font-light !px-0 !font-normal',
      },
      size: {
        sm: 'py-1 px-4 text-sm',
        md: 'py-2 px-5 text-sm',
        lg: 'px-6 py-3 text-lg',
      },
    },
  }
);

const iconVariants = cva('', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
  },
});

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    isLoading = false,
    children,
    loadingText,
    disabled,
    fullWidth = false,
    className = '',
    variant = 'default',
    size = 'md',
    icon,
    ...rest
  } = props;

  const disabledClass = 'opacity-50 cursor-not-allowed pointer-events-none';

  return (
    <button
      ref={ref}
      className={clsx(
        buttonVariants({
          variant,
          size,
        }),
        {
          [disabledClass]: disabled,
        },
        {
          'w-full': fullWidth,
        },
        className
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          {!!loadingText && loadingText}
          <span role="status">
            <LoadingIcon
              className={clsx('animate-spin', iconVariants({ size }))}
              aria-hidden="true"
            />
          </span>
        </div>
      ) : (
        <span className="flex items-center justify-center gap-2">
          {children && (
            <span
              className={clsx({
                'opacity-0 pointer-events-none': isLoading,
              })}
            >
              {children}
            </span>
          )}
          {icon && !isLoading && (
            <span
              className={clsx(
                'flex  items-center justify-center',
                iconVariants({ size })
              )}
            >
              {icon}
            </span>
          )}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
