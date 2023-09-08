import React, { forwardRef } from 'react';
import { AiOutlineLoading3Quarters as LoadingIcon } from '@react-icons/all-files/ai/AiOutlineLoading3Quarters';
import clsx from 'clsx';
import { VariantProps, cva } from 'class-variance-authority';
import NextLink from 'next/link';

const linkVariants = cva(
  'rounded-md font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 flex items-center justify-center gap-2 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'ring-1 shadow-sm bg-violet-600 hover:bg-violet-700 text-white ring-violet-600',
        outline:
          'ring-1 shadow-sm bg-transparent hover:bg-violet-700 text-violet-700 ring-1 ring-violet-600 hover:bg-violet-100 hover:text-white',
        destructive:
          'ring-1 shadow-sm bg-red-700 hover:bg-red-600 text-white ring-red-700',
        destructiveOutline:
          'ring-1 shadow-sm bg-transparent hover:bg-red-700 text-red-700 ring-1 ring-red-700 hover:bg-red-100 hover:text-white',
        success:
          'ring-1 shadow-sm bg-[#4ade80] hover:bg-[#3dba6b] text-white ring-[#4ade80] hover:ring-[#3dba6b]',
        ghost:
          'bg-transparent text-violet-700 ring-1 ring-transparent hover:bg-violet-100 hover:ring-violet-100',
        destructiveGhost:
          'bg-transparent text-red-700 ring-1 ring-transparent hover:bg-red-100 hover:ring-red-100',
      },
      size: {
        sm: 'py-1 px-4 text-sm',
        md: 'py-2 px-5 text-base',
        lg: 'px-6 py-3 text-lg',
      },
    },
  }
);

export interface LinkProps
  extends React.ComponentPropsWithoutRef<'a'>,
    VariantProps<typeof linkVariants> {
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const {
    children,
    fullWidth = false,
    href = '/',
    className = '',
    variant = 'default',
    size = 'md',
    icon,
    ...rest
  } = props;

  return (
    <NextLink
      ref={ref}
      href={href}
      className={clsx(
        linkVariants({
          variant,
          size,
        }),
        {
          'w-full': fullWidth,
        },
        className
      )}
      {...rest}
    >
      <span className="flex items-center justify-center gap-2">
        {icon && (
          <span className="h-4 w-4 flex  items-center justify-center ">
            {icon}
          </span>
        )}
        {children && children}
      </span>
    </NextLink>
  );
});

Link.displayName = 'Link';
export default Link;
