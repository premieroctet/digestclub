'use client';
import PageContainer from '@/components/layout/PageContainer';
import React from 'react';
import { Breadcrumb } from '../../Breadcrumb';
import { TEAM_SETTINGS_ITEMS, routes } from '@/core/constants';
import TeamToolBar from './TeamToolBar';
import { usePathname } from 'next/navigation';

function getTeamSettingsActiveItem(
  currentPath: string | null,
  teamSlug: string
) {
  if (!currentPath) return null;
  const item = TEAM_SETTINGS_ITEMS.find((item) => {
    return item.routePath.replace(':slug', teamSlug) === currentPath;
  });
  if (!item) return null;
  return item;
}

export default function TeamSettingsPageLayout({
  children,
  team,
}: {
  children: React.ReactNode;
  team: {
    slug: string;
    name: string;
  };
}) {
  const pathname = usePathname();
  const activeItem = getTeamSettingsActiveItem(pathname, team.slug);
  return (
    <PageContainer
      breadCrumb={
        <Breadcrumb
          paths={[
            {
              name: team.name,
              href: routes.TEAM.replace(':slug', team.slug),
            },
            {
              name: 'Settings',
              // href: routes.TEAMS_EDIT.replace(':slug', team.slug),
            },
            ...(activeItem
              ? [
                  {
                    name: activeItem.title,
                    href: activeItem.routePath.replace(':slug', team.slug),
                  },
                ]
              : []),
          ]}
        />
      }
    >
      <div className="flex md:flex-row flex-col gap-4 shadow-md bg-white rounded-lg">
        <TeamToolBar teamSlug={team.slug} />
        <div className="flex-1 py-4">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </PageContainer>
  );
}
