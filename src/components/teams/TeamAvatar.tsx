import { Team } from '@prisma/client';
import clsx from 'clsx';

const TeamAvatar = ({ team }: { team: Partial<Team> }) => {
  const { name } = team;
  return (
    <div
      className={clsx(
        'inline-block text-white h-8 w-8 rounded-full ring-2 ring-white flex items-center justify-center font-bold'
      )}
      style={{
        backgroundColor: team?.color ?? '#6d28d9',
      }}
    >
      {name ? name[0].toUpperCase() : 'Team'}
    </div>
  );
};

export default TeamAvatar;
