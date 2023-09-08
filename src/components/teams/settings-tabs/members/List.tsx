import { Member } from '@/lib/queries';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { Session } from 'next-auth';
import { UserRoles } from '@/core/constants';
import Item from './Item';

interface Props {
  memberships: Member[];
  currentUser: Session['user'];
}

const List = ({ memberships, currentUser }: Props) => {
  if (memberships.length === 0) {
    return (
      <>
        <span className="inline-flex items-center rounded-md bg-gray-200 px-3 py-3 text-sm font-medium text-gray-600 w-full gap-2">
          <span className="h-4 w-4">
            <InformationCircleIcon />
          </span>
          <p>
            No user found, click on the{' '}
            <strong className="text-violet-700">Invitations</strong> tab to
            invite users
          </p>
        </span>
      </>
    );
  }

  const currentUserIsAdmin = memberships.some(
    (membership) =>
      membership.user?.id === currentUser?.id &&
      membership.role === UserRoles.ADMIN
  );

  return (
    <div>
      {memberships.map((membership) => {
        const isOwner = membership.user?.id === currentUser?.id;
        return (
          <Item
            key={membership.user?.id}
            membership={membership}
            canDelete={!isOwner && currentUserIsAdmin}
          />
        );
      })}
    </div>
  );
};

export default List;
