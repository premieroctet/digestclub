import { routes } from '@/core/constants';
import PageContainer from '@/components/layout/PageContainer';
import { Breadcrumb } from '@/components/teams/Breadcrumb';
import Loader from '@/components/Loader';
import TeamToolBar from '@/components/teams/form/settings/TeamToolBar';
import { getCurrentUser } from '@/lib/sessions';
import React from 'react';
import { checkUserTeamBySlug } from '@/lib/queries';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { redirect } from 'next/navigation';

import TeamSettingsPageLayout from '@/components/teams/form/settings/TeamSettingsPageLayout';

type Props = {
  params: {
    teamSlug: string;
  };
  children: React.ReactNode;
};

const Layout = async ({ children, params }: Props) => {
  const teamSlug = params.teamSlug;
  const user = await getCurrentUser();
  if (!user) {
    return redirect(authOptions.pages!.signIn!);
  }
  const team = await checkUserTeamBySlug(teamSlug, user.id);

  if (!team) {
    redirect('/teams');
  }
  if (!team) return <Loader fullPage />;

  return (
    <TeamSettingsPageLayout team={team}>{children}</TeamSettingsPageLayout>
  );
};

export default Layout;
