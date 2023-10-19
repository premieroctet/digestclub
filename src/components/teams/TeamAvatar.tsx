import { Team } from '@prisma/client';
import clsx from 'clsx';
import { HTMLProps } from 'react';

const TeamAvatar = ({
  team,
  className,
}: {
  team: Partial<Team>;
  className?: HTMLProps<HTMLElement>['className'];
}) => {
  const { name } = team;
  return (
    <div
      className={clsx(
        'text-white h-8 w-8 rounded-full ring-2 ring-white flex items-center justify-center font-bold',
        className
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
