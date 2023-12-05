import React from 'react';
import { getCurrentUser } from '@/lib/sessions';
import AccountForm from '@/components/account/AccountForm';
import { notFound } from 'next/navigation';
import UserInvitations from '@/components/account/UserInvitations';
import { getUserInvitations } from '@/lib/queries';
import SettingsPageLayout from '@/components/teams/form/settings/SettingsPageLayout';
import { UserCircleIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'My account',
};

const AccountPage = async () => {
  const user = await getCurrentUser();
  if (!user) return notFound();
  const invitations = await getUserInvitations(user!.email as string);

  return (
    <SettingsPageLayout
      title="My account"
      subtitle="Manage your account"
      menuItems={[
        {
          id: 'account',
          title: 'Account',
          href: '/account',
          icon: <UserCircleIcon className="w-6 h-6" />,
          isActive: true,
        },
      ]}
      breadcrumbItems={[
        {
          name: 'Settings',
        },
        {
          name: 'Account',
        },
      ]}
    >
      <div className="flex flex-col space-y-6 content-stretch">
        <AccountForm user={user!} />
        <UserInvitations invitations={invitations} />
      </div>
    </SettingsPageLayout>
  );
};

export default AccountPage;
