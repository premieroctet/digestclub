import { ReactNode } from 'react';
import { Tooltip } from '../Tooltip';
import Button from '../Button';
import clsx from 'clsx';

function SmallItem({
  title,
  icon,
  handleClick,
  isSelected,
}: {
  title: string;
  icon: ReactNode;
  handleClick: () => void;
  isSelected: boolean;
}) {
  return (
    <div className="lg:hidden block">
      <Tooltip
        side="left"
        asChild
        trigger={
          <Button
            variant={isSelected ? 'default' : 'ghost'}
            className="w-6"
            onClick={handleClick}
          >
            {icon}
          </Button>
        }
      >
        {title}
      </Tooltip>
    </div>
  );
}

function LargeItem({
  title,
  icon,
  handleClick,
  isSelected,
}: {
  title: string;
  icon: ReactNode;
  handleClick: () => void;
  isSelected: boolean;
}) {
  return (
    <div
      className={clsx(
        'hidden lg:flex gap-5 items-center  text-gray-700 py-3 px-4 rounded-md cursor-pointer ',
        {
          'text-white opacity-100 bg-violet-700 shadow-md': isSelected,
          'opacity-50 hover:bg-violet-100 hover:opacity-100 hover:text-violet-700':
            !isSelected,
        }
      )}
      onClick={handleClick}
    >
      <p className="text-base font-medium  w-[12ch]">{title}</p>
      <span className="w-6">{icon}</span>
    </div>
  );
}

const TeamToolBarItem = ({
  title,
  icon,
  handleClick,
  isSelected,
}: {
  title: string;
  icon: ReactNode;
  handleClick: () => void;
  isSelected: boolean;
}) => {
  return (
    <div className="flex items-center">
      <SmallItem
        title={title}
        icon={icon}
        handleClick={handleClick}
        isSelected={isSelected}
      />
      <LargeItem
        title={title}
        icon={icon}
        handleClick={handleClick}
        isSelected={isSelected}
      />
    </div>
  );
};

export default TeamToolBarItem;
