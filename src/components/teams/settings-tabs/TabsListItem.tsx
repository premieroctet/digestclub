import { MembershipRole } from '@prisma/client';
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import Avatar from '../../Avatar';
import { DeletePopover } from '../../Popover';

interface UserRoleBadge extends VariantProps<typeof userBadgeVariants> {
  status: MembershipRole | 'PENDING';
}

const userBadgeVariants = cva(
  'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ',
  {
    variants: {
      type: {
        admin: 'bg-violet-100 text-violet-800',
        default: 'bg-gray-200 text-gray-800',
      },
    },
  }
);

const Badge = ({ status, type = 'default' }: UserRoleBadge) => {
  return (
    <span
      className={userBadgeVariants({
        type,
      })}
    >
      {status}
    </span>
  );
};

interface ListItemProps {
  name: string;
  deleteItem?: () => void;
  isLoading?: boolean;
  badge?: UserRoleBadge;
}

export default function ListItem({
  name,
  deleteItem,
  isLoading,
  badge,
}: ListItemProps) {
  return (
    <div role="group" className="flex gap-2 p-2 rounded-md bg-gray-50">
      <div className="w-full flex gap-2">
        <Avatar size="sm" name={name} />
        <div className="flex gap-2 justify-between items-center w-full">
          <p className="overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[14rem] text-gray-900 font-semibold text-sm">
            {name}
          </p>
          <div className="flex gap-2 justify-between self-end items-center">
            {deleteItem !== undefined && (
              <DeletePopover
                handleDelete={() => {
                  deleteItem();
                }}
                isLoading={isLoading || false}
              />
            )}
            {badge && <Badge status={badge.status} type={badge.type} />}
          </div>
        </div>
      </div>
    </div>
  );
}
