'use client';
import TeamToolBarItem from '../../TeamToolBarItem';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export interface TeamToolBarItem {
  id: string;
  title: string;
  icon: ReactNode;
  isActive: boolean;
  href: string;
}

export interface SettingToolBarProps {
  items: TeamToolBarItem[];
}

const SettingToolBar = ({ items }: SettingToolBarProps) => {
  const pathname = usePathname();
  return (
    <div>
      <div className="flex md:flex-col flex-row justify-around  md:gap-7 lg:gap-4 sm:gap-10 gap-2 lg:px-4 md:px-2 py-4">
        {items.map(({ title, icon, id, href }) => {
          return (
            <TeamToolBarItem
              key={id}
              title={title}
              icon={icon}
              href={href}
              isActive={pathname === href}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SettingToolBar;
