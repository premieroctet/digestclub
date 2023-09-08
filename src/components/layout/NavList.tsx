'use client';

import { mainNavigation } from '@/core/constants';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { Fragment, useEffect } from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { AiOutlineMenu } from '@react-icons/all-files/ai/AiOutlineMenu';
const ListItem = ({
  pathName,
  route,
  label,
}: {
  pathName: string | null;
  route: string;
  label: string;
}) => (
  <Link
    className={clsx(
      ' hover:text-gray-700 py-3 md:py-2 text-xs sm:text-sm 2xl:text-base',
      pathName && pathName.split('/')[1] === route.split('/')[1]
        ? 'text-gray-900'
        : 'text-gray-400'
    )}
    href={route}
  >
    {label}
  </Link>
);

const MenuItem = ({
  pathName,
  route,
  label,
}: {
  pathName: string | null;
  route: string;
  label: string;
}) => (
  <li
    className={clsx(
      'p-2',
      pathName && pathName.split('/')[1] === route.split('/')[1]
        ? 'text-gray-900'
        : 'text-gray-400'
    )}
  >
    <NavigationMenu.Link
      asChild
      active={Boolean(
        pathName && pathName.split('/')[1] === route.split('/')[1]
      )}
    >
      <Link href={route}>{label}</Link>
    </NavigationMenu.Link>
  </li>
);

export default function NavList() {
  const pathName = usePathname();

  return (
    <div className="relatve">
      <div className="hidden sm:flex flex-row gap-2 sm:gap-4 items-center">
        {mainNavigation.map((item, index) => (
          <Fragment key={`${item.route}-nav-list-fragment`}>
            <ListItem pathName={pathName} {...item} />
            {index !== mainNavigation.length - 1 && (
              <span className="text-gray-400 text-sm">|</span>
            )}
          </Fragment>
        ))}
      </div>
      <NavigationMenu.Root className="flex sm:hidden h-full content-start items-stretch">
        <NavigationMenu.List className="flex items-stretch h-full">
          <NavigationMenu.Item asChild>
            <div className="flex items-stretch">
              <NavigationMenu.Trigger
                onPointerMove={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}
                className="group p-2 flex flex-row gap-2 items-center hover:text-violet-600 data-[state=open]:text-violet-600"
              >
                <AiOutlineMenu size={24} />
              </NavigationMenu.Trigger>

              <NavigationMenu.Content
                onPointerEnter={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}
                className="absolute left-0 top-[44px] left-100 z-30 animate-in fade-in duration-300"
              >
                <div className="w-auto sm:min-w-[224px] flex-auto overflow-hidden rounded-md bg-white text-sm 2xl:text-base leading-6 shadow-lg ring-1 ring-gray-900/5">
                  <ul className="p-2 flex flex-col gap-2">
                    {mainNavigation.map((item, index) => (
                      <Fragment key={`${item.route}-nav-menu-fragment`}>
                        <MenuItem {...item} pathName={pathName} />
                        {index !== mainNavigation.length - 1 && (
                          <span className="border-b border-gray-200"></span>
                        )}
                      </Fragment>
                    ))}
                  </ul>
                </div>
              </NavigationMenu.Content>
            </div>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  );
}
