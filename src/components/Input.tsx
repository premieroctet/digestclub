import clsx from 'clsx';
import { forwardRef, HTMLProps } from 'react';

export const Input = forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        className={clsx(
          'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 disabled:ring-gray-200 disabled:shadow-none',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  HTMLProps<HTMLTextAreaElement>
>(function TextArea({ className, ...props }, ref) {
  return (
    <textarea
      className={clsx(
        'block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6 w-full h-20 text-base border-b border-gray-300 focus:outline-none focus:border-violet-500 p-3 px-4',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

interface SelectOptionProps<T = string> {
  label: string;
  value: T;
}

interface SelectProps<T> extends HTMLProps<HTMLSelectElement> {
  options: Array<SelectOptionProps<T>>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps<any>>(
  function Select({ options, className, ...props }, ref) {
    return (
      <select
        className={clsx(
          'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6',
          className
        )}
        ref={ref}
        {...props}
      >
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            <span className="lowercase">{label}</span>
          </option>
        ))}
      </select>
    );
  }
);
