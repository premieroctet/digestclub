import { HTMLProps } from 'react';

export const CounterTag = ({
  count,
  className,
  ...props
}: HTMLProps<HTMLSpanElement> & { count: number }) => {
  return (
    <>
      {count > 0 && (
        <span
          className={`inline-flex items-center rounded-md  text-violet-500 bg-violet-100  bg-gradient-to-tl  px-2.5 py-1 text-xs font-medium ${
            className && className
          }`}
          {...props}
        >
          {count}
        </span>
      )}
    </>
  );
};
