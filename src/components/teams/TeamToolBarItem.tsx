'use client';

import { ReactNode } from 'react';
import { Tooltip } from '../Tooltip';
import Button from '../Button';
import clsx from 'clsx';
import NextLink from 'next/link';
import Link from '../Link';

interface ItemProps {
  title: string;
  icon: ReactNode;
  isActive: boolean;
  href: string;
}

function SmallItem({ title, icon, isActive, href }: ItemProps) {
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

function LargeItem({ title, icon, isActive, href }: ItemProps) {
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

const TeamToolBarItem = ({ title, icon, isActive, href }: ItemProps) => {
  return (
    <div className="flex items-center flex-1 md:flex-auto">
      <SmallItem title={title} icon={icon} isActive={isActive} href={href} />
      <LargeItem title={title} icon={icon} isActive={isActive} href={href} />
    </div>
  );
};

export default TeamToolBarItem;
