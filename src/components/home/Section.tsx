import clsx from 'clsx';
import { ReactNode } from 'react';
import SectionTitle from '../heading/SectionTitle';

const Section = ({
  children,
  title,
  caption,
  className,
}: {
  children: ReactNode;
  title: ReactNode;
  caption?: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        `p-4 m-auto py-16 text-gray-900 w-full h-full flex flex-col items-center gap-16`,
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <SectionTitle>{title}</SectionTitle>
        {Boolean(caption) && (
          <p className="mt-4 text-lg text-slate-700 mx-auto max-w-2xl text-center">
            {caption}
          </p>
        )}
      </div>
      {children}
    </div>
  );
};

export default Section;
