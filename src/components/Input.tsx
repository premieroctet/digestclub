import clsx from 'clsx';
import { forwardRef, HTMLProps, useState } from 'react';

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

export const Switch = forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>(
  function Switch({ label, onChange, checked, ...props }, ref) {
    const [isChecked, setIsChecked] = useState(checked);
    return (
      <label className="relative inline-flex  cursor-pointer">
        <div className="flex-1">
          <input
            type="checkbox"
            checked={isChecked}
            className="sr-only peer"
            onChange={(e) => {
              setIsChecked(!isChecked);
              onChange && onChange(e);
            }}
            ref={ref}
            {...props}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 dark:peer-focus:ring-violet-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-violet-600"></div>
        </div>
        <span
          className={`ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 ${
            !isChecked ? 'opacity-60' : 'opacity-100'
          }`}
        >
          {label}
        </span>
      </label>
    );
  }
);
