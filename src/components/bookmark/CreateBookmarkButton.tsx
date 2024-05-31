'use client';

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
