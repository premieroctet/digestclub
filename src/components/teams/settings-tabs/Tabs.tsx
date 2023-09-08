import message from '@/messages/en';
import * as Tabs from '@radix-ui/react-tabs';

interface ISettingsTabs {
  nbMembers: number;
  nbInvitations: number;
  nbSubscriptions: number;
}

const SettingsTabs = ({
  nbMembers,
  nbInvitations,
  nbSubscriptions,
}: ISettingsTabs) => {
  function formatNumber(number: number) {
    return number > 99 ? '+99' : number;
  }
  return (
    <div>
      <div>
        <Tabs.List
          className="shrink-0 flex border-b border-mauve6"
          aria-label="Manage your account"
        >
          <Tabs.Trigger
            value="members"
            className="bg-white px-2 h-[45px] flex-1 flex items-center justify-center text-base leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet-700 data-[state=active]:text-violet-700 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative  outline-none cursor-default"
          >
            {message.team.settings.members}
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 ml-2">
              {formatNumber(nbMembers)}
            </span>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="invitations"
            className="bg-white px-2 h-[45px] flex-1 flex items-center justify-center  text-base leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet-700 data-[state=active]:text-violet-700 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative  outline-none cursor-default"
          >
            {message.team.settings.invitations}
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 ml-2">
              {formatNumber(nbInvitations)}
            </span>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="subscribers"
            className="bg-white px-2 h-[45px] flex-1 flex items-center justify-center  text-base leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet-700 data-[state=active]:text-violet-700 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative  outline-none cursor-default"
          >
            Newsletter
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 ml-2">
              {formatNumber(nbSubscriptions)}
            </span>
          </Tabs.Trigger>
        </Tabs.List>
      </div>
    </div>
  );
};

export default SettingsTabs;
