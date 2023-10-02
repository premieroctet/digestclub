'use client';

import SectionContainer from '../layout/SectionContainer';
import { UserInvitationsResults } from '@/lib/queries';
import UserInvitationItem from './UserInvitationItem';

const UserInvitations = ({
  invitations,
}: {
  invitations: UserInvitationsResults;
}) => {
  return (
    <SectionContainer
      title="User invitations"
      className="flex justify-center max-w-2xl m-auto w-full"
    >
      <p className="pb-4">Find all pending invitations below</p>
      {!invitations?.length && <p>You have no pending invitations</p>}
      <div className="flex flex-col space-y-4">
        {invitations?.map((invitation) => (
          <UserInvitationItem key={invitation?.id} invitation={invitation} />
        ))}
      </div>
    </SectionContainer>
  );
};

export default UserInvitations;
