'use client';

import { PlusIcon } from '@heroicons/react/24/solid';
import { Team } from '@prisma/client';
import { useState } from 'react';
import Button from '../Button';
import { Dialog, DialogContent, DialogTrigger } from '../Dialog';
import { BookmarkModal } from './BookmarkModal';

interface Props {
  team: Team;
}

export default function CreateBookmarkButton({ team }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsDialogOpen(true)}
          variant="default"
          size="md"
          icon={<PlusIcon className="h-4 w-4" aria-hidden="true" />}
          title="Create a new bookmark"
          className="px-0"
        >
          New bookmark
        </Button>
      </DialogTrigger>
      <DialogContent
        containerClassName="w-full sm:max-w-md"
        title="New bookmark"
        description="Add a new link to your team feed"
        closeIcon
      >
        <BookmarkModal onSuccess={() => setIsDialogOpen(false)} team={team} />
      </DialogContent>
    </Dialog>
  );
}
