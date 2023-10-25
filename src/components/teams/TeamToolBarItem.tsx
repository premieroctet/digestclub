import { ReactNode } from 'react';
import { Tooltip } from '../Tooltip';
import Button from '../Button';

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
    <Tooltip
      side="left"
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
  );
};

export default TeamToolBarItem;
