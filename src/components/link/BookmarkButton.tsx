import { Team } from '@prisma/client';
import { FaTelegramPlane } from '@react-icons/all-files/fa/FaTelegramPlane';
import { BookmarkModal } from './BookmarkModal';
import { Dialog, DialogContent, DialogTrigger } from '../Dialog';
import { useState } from 'react';

type Props = { team: Team };

const BookmarkButton = ({ team }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button
          className="btn-add-link"
          aria-label="Add bookmark"
          title="Add bookmark"
        >
          <span className="hidden md:block">Add Bookmark</span>
          <FaTelegramPlane />
        </button>
      </DialogTrigger>
      <DialogContent
        containerClassName="w-full sm:max-w-md"
        title="New Bookmark"
        description="Add a new link to your team feed"
        closeIcon
      >
        <BookmarkModal onSuccess={() => setIsDialogOpen(false)} team={team} />
      </DialogContent>
    </Dialog>
  );
};

export default BookmarkButton;
