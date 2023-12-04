'use client';
import { TEAM_SETTINGS_ITEMS } from '@/core/constants';
import TeamToolBarItem from '../../TeamToolBarItem';

import { usePathname } from 'next/navigation';

const TeamToolBar = ({ teamSlug }: { teamSlug: string }) => {
  const pathname = usePathname();
  return (
    <div>
      <div className="flex md:flex-col flex-row justify-around  md:gap-7 lg:gap-4 sm:gap-10 gap-2 lg:px-4 md:px-2 py-4">
        {TEAM_SETTINGS_ITEMS.map(({ title, icon, id, routePath }) => {
          const itemPath = routePath.replace(':slug', teamSlug);
          return (
            <TeamToolBarItem
              key={id}
              title={title}
              icon={icon}
              href={itemPath}
              isActive={pathname === itemPath}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TeamToolBar;
