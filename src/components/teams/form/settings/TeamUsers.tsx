import { Member, TeamInvitation } from '@/lib/queries';
import MembersList from '../../settings-tabs/members/List';
import SubscribersList from '../../settings-tabs/subscribers/List';
import SettingsTabs from '../../settings-tabs/Tabs';
import * as Tabs from '@radix-ui/react-tabs';
import { Session } from 'next-auth';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import useCustomToast from '@/hooks/useCustomToast';
import { Subscription } from '@prisma/client';
import message from '@/messages/en';
import InvitationForm from '../../settings-tabs/invitations/InvitationForm';
import InvitationList from '../../settings-tabs/invitations/InvitationList';
import TeamMenuTitle from '../../TeamMenuTitle';
import TeamMenuContent from '../../TeamMenuContent';

type Props = {
  members: Member[];
  invitations: TeamInvitation[];
  teamId: string;
  user: Session['user'];
  subscriptions: Subscription[];
};

const TeamUsers = ({
  members,
  invitations,
  teamId,
  user,
  subscriptions,
}: Props) => {
  const [emailInvitation, setEmailInvitation] = useState('');
  const { refresh } = useRouter();
  const { successToast, errorToast } = useCustomToast();

  const { mutate: sendInvitation, isLoading } = useMutation<
    AxiosResponse<any>,
    AxiosResponse<any>,
    {
      email: string;
      teamId: string;
    }
  >(
    'send-invite',
    ({ email, teamId }) =>
      api.post(`/teams/${teamId}/invitations`, {
        email,
      }),
    {
      onSuccess: () => {
        successToast(message.team.settings.invite.success);
        setEmailInvitation('');
        refresh();
      },
      onError: (error: any) => {
        errorToast(error.response.data.error);
      },
    }
  );

  const onSendInvitation = async () => {
    sendInvitation({ email: emailInvitation, teamId });
  };
  return (
    <div>
      <TeamMenuTitle
        title="Members and Subscriptions"
        subtitle="Manage your team members, invitations and newsletter subscriptions"
      />
      <TeamMenuContent>
        <Tabs.Root
          defaultValue="members"
          className="flex flex-col min-w-[300px] pt-4"
        >
          <SettingsTabs
            nbMembers={members.length}
            nbInvitations={invitations.length}
            nbSubscriptions={subscriptions.length}
          />
          <Tabs.Content value="members">
            <div className="pt-8">
              <MembersList memberships={members} currentUser={user} />
            </div>
          </Tabs.Content>
          <Tabs.Content value="invitations">
            <div className="pt-8 flex flex-col items-stretch max-h-screen overflow-auto">
              <InvitationForm
                onSend={onSendInvitation}
                isLoading={isLoading}
                email={emailInvitation}
                setEmail={setEmailInvitation}
                label="Send"
              />
              <InvitationList invitations={invitations} />
            </div>
          </Tabs.Content>
          <Tabs.Content value="subscribers">
            <div className="pt-8 flex flex-col items-stretch max-h-screen overflow-auto">
              <SubscribersList subscriptions={subscriptions} />
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </TeamMenuContent>
    </div>
  );
};

export default TeamUsers;
