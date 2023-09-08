'use client';

import clsx from 'clsx';
import React, { HTMLProps, PropsWithChildren } from 'react';

interface IProps {
  title?: string;
  breadCrumb?: React.ReactNode;
}

const PageContainer = ({
  title,
  breadCrumb,
  children,
  className,
  ...props
}: PropsWithChildren & IProps & HTMLProps<HTMLDivElement>) => (
  <main className={clsx('h-full flex flex-col w-full', className)} {...props}>
    {breadCrumb && breadCrumb}
    <div className={clsx('flex-1 mb-4', breadCrumb ? 'mt-0' : 'mt-4')}>
      <h1 className="font-bold text-3xl">{title}</h1>
      <div className={clsx(title && 'mt-4')}>{children}</div>
    </div>
  </main>
);

export default PageContainer;
