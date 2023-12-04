'use client';

import PageContainer from '@/components/layout/PageContainer';
import React from 'react';
import { Breadcrumb } from '../../Breadcrumb';
import TeamToolBar from './TeamToolBar';
import { routes } from '@/core/constants';

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-4 pb-4 pt-4">
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
  return <div className="flex flex-col gap-4 max-w-[600px]">{children}</div>;
}

export default function SettingsPageLayout({
  children,
  team,
  title,
  subtitle,
  breadcrumbCurrentItem,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  team: {
    slug: string;
    name: string;
  };
  icon?: React.ReactNode;
  breadcrumbCurrentItem?: {
    name: string;
    href: string;
  };
}) {
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
            },
            ...(breadcrumbCurrentItem ? [breadcrumbCurrentItem] : []),
          ]}
        />
      }
    >
      <div className="flex md:flex-row flex-col gap-4 shadow-md bg-white rounded-lg px-8 md:px-0">
        <TeamToolBar teamSlug={team.slug} />
        <div className="flex-1 py-4">
          <div className="w-full">
            <Header title={title} subtitle={subtitle} />
            <Content>{children}</Content>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
