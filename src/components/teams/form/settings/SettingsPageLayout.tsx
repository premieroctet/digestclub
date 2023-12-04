'use client';

import PageContainer from '@/components/layout/PageContainer';
import React from 'react';
import { Breadcrumb } from '../../Breadcrumb';
import { Props as BreadcrumbProps } from '../../Breadcrumb';

import { ReactNode } from 'react';
import clsx from 'clsx';
import NextLink from 'next/link';
import { Tooltip } from '@/components/Tooltip';
import Link from '@/components/Link';
import { usePathname } from 'next/navigation';

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-4 pb-4 pt-4 md:border-b-2 md:border-neutral-100 md:pl-6">
      <div>
        <h3 className="text-3xl font-semibold leading-7">{title}</h3>
        <span className="text-sm text-gray-500 font-light block mt-4">
          {subtitle}
        </span>
      </div>
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 md:px-6 ">{children}</div>;
}

function SmallItem({ title, icon, isActive, href }: ToolBarItem) {
  return (
    <div className="lg:hidden block w-full">
      <Tooltip
        side="left"
        asChild
        trigger={
          <Link
            href={href}
            className="w-full md:w-6"
            variant={isActive ? 'default' : 'ghost'}
          >
            {icon}
          </Link>
        }
      >
        {title}
      </Tooltip>
    </div>
  );
}

function LargeItem({ title, icon, isActive, href }: ToolBarItem) {
  return (
    <NextLink
      href={href}
      className={clsx(
        'hidden lg:flex gap-5 items-center  text-gray-700 py-3 px-4 rounded-md cursor-pointer ',
        {
          'opacity-100 text-violet-700 ': isActive,
          'opacity-50 hover:bg-violet-100 hover:opacity-100 hover:text-violet-700':
            !isActive,
        }
      )}
    >
      <p className="text-base font-medium  w-[12ch]">{title}</p>
      <span className="w-6">{icon}</span>
    </NextLink>
  );
}

function ToolBarItem(props: ToolBarItem) {
  return (
    <div
      className={clsx('flex items-center flex-1 sm:flex-auto', {
        'lg:border-l-2 lg:border-violet-700': props.isActive,
      })}
    >
      <SmallItem {...props} />
      <LargeItem {...props} />
    </div>
  );
}

export interface ToolBarItem {
  id: string;
  title: string;
  icon: ReactNode;
  isActive: boolean;
  href: string;
}

function Toolbar({ items }: { items: ToolBarItem[] }) {
  const pathname = usePathname();
  return (
    <div className="md:border-r-2 md:border-neutral-100">
      <div className="flex md:flex-col flex-row justify-around md:gap-7 lg:gap-4 sm:gap-10 gap-2 lg:px-4 md:px-2 py-4">
        {items.map(({ id, href, ...props }) => {
          return (
            <ToolBarItem
              key={id}
              id={id}
              href={href}
              {...props}
              isActive={pathname === href}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function SettingsPageLayout({
  children,
  title,
  subtitle,
  breadcrumbItems,
  menuItems,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  breadcrumbItems?: BreadcrumbProps['paths'];
  menuItems: ToolBarItem[];
}) {
  return (
    <PageContainer
      breadCrumb={
        breadcrumbItems && <Breadcrumb paths={[...breadcrumbItems]} />
      }
    >
      <div className="flex md:flex-row flex-col gap-4 md:gap-0 shadow-md bg-white rounded-lg px-8 md:px-0">
        <Toolbar items={menuItems} />
        <div className="flex-1 pt-4 pb-6">
          <div className="w-full">
            <Header title={title} subtitle={subtitle} />
            <Content>{children}</Content>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
