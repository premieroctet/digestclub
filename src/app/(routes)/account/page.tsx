import React from 'react';
import { getCurrentUser } from '@/lib/sessions';
import PageContainer from '@/components/layout/PageContainer';
import AccountForm from '@/components/account/AccountForm';
import SectionContainer from '@/components/layout/SectionContainer';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'My account',
};

const AccountPage = async () => {
  const user = await getCurrentUser();
  if (!user) return notFound();

  return (
    <PageContainer>
      <SectionContainer
        title="My account"
        className="flex justify-center max-w-2xl m-auto"
      >
        <AccountForm user={user!} />
      </SectionContainer>
    </PageContainer>
  );
};

export default AccountPage;
