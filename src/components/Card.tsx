import clsx from 'clsx';
import { HTMLProps, PropsWithChildren, ReactNode } from 'react';

export const Card = ({
  children,
  header,
  footer,
  className,
  ...props
}: PropsWithChildren & {
  header?: ReactNode;
  footer?: ReactNode;
} & HTMLProps<HTMLDivElement>) => {
  return (
    <section
      className={clsx(
        'divide-y divide-gray-100 overflow-hidden h-min rounded-lg bg-white shadow',
        className
      )}
      {...props}
    >
      {header && <div className="p-4">{header}</div>}
      <div className="px-4 py-5 sm:p-6 w-full flex justify-center">
        {children}
      </div>
      {footer && <div className="px-4 py-4 sm:px-6">{footer}</div>}
    </section>
  );
};

export default Card;
