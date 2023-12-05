import { TeamInvitation } from '@/services/database/invitation';
import ListItem from '../TabsListItem';

type Props = {
  invitation: TeamInvitation;
  deleteInvitation: (invitation: TeamInvitation) => void;
  isLoading?: boolean;
};

const InvitationItem = ({ invitation, deleteInvitation, isLoading }: Props) => {
  const membership = invitation.membership;
  const name =
    membership?.user?.name ||
    membership.invitedName ||
    membership.invitedEmail ||
    'Anonymous';

  return (
    <ListItem
      key={invitation.id}
      name={name}
      badge={{
        status: 'PENDING',
        type: 'default',
      }}
      isLoading={isLoading}
      deleteItem={() => {
        deleteInvitation(invitation);
      }}
    />
  );
};

export default InvitationItem;
