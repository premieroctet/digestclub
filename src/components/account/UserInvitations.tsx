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
    <div className="py-2">
      {invitations?.length ? (
        <p className="pb-4">Find all pending invitations below</p>
      ) : (
        <p>You have no pending invitations</p>
      )}
      <div className="flex flex-col space-y-4">
        {invitations?.map((invitation) => (
          <UserInvitationItem key={invitation?.id} invitation={invitation} />
        ))}
      </div>
    </div>
  );
};

export default UserInvitations;
