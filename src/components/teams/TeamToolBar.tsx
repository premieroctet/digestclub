import TeamToolBarItem from './TeamToolBarItem';
import {
  PencilSquareIcon,
  LinkIcon,
  UserIcon,
  EnvelopeIcon,
  KeyIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/outline';

export const TEAM_SETTINGS_ITEMS = [
  {
    id: 'info',
    title: 'Team info',
    icon: <PencilSquareIcon className="h-7 w-7" />,
  },
  {
    id: 'integrations',
    title: 'Integrations',
    icon: <KeyIcon className="h-7 w-7" />,
  },
  {
    id: 'members',
    title: 'Members',
    icon: <UserIcon className="h-7 w-7" />,
  },
  {
    id: 'templates',
    title: 'Templates',
    icon: <ViewColumnsIcon className="h-7 w-7" />,
  },
];

const TeamToolBar = ({
  selectedMenu,
  setSelectedMenu,
}: {
  selectedMenu: string;
  setSelectedMenu: (id: string) => void;
}) => {
  return (
    <div>
      <div className="flex md:flex-col flex-row justify-around md:gap-7 lg:gap-4 sm:gap-10 gap-8 lg:px-4 md:px-2 px-4 py-4 shadow-md bg-white rounded-lg ">
        {TEAM_SETTINGS_ITEMS.map(({ title, icon, id }) => (
          <TeamToolBarItem
            key={id}
            title={title}
            icon={icon}
            handleClick={() => setSelectedMenu(id)}
            isSelected={selectedMenu === id}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamToolBar;
