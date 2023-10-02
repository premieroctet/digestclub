import React from 'react';
import { getCurrentUser } from '@/lib/sessions';
import PageContainer from '@/components/layout/PageContainer';
import AccountForm from '@/components/account/AccountForm';
import { notFound } from 'next/navigation';
import UserInvitations from '@/components/account/UserInvitations';
import { getUserInvitations } from '@/lib/queries';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'My account',
};

const AccountPage = async () => {
  const user = await getCurrentUser();
  if (!user) return notFound();
  const invitations = await getUserInvitations(user!.email as string);

  return (
    <PageContainer>
      <div className="flex flex-col space-y-6 content-stretch">
        <AccountForm user={user!} />
        <UserInvitations invitations={invitations} />
      </div>
    </PageContainer>
  );
};

export default AccountPage;
