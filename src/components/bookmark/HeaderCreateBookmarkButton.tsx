import { PlusIcon } from '@heroicons/react/24/solid';
import { Team } from '@prisma/client';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '../Dialog';
import { BookmarkModal } from './BookmarkModal';

type Props = { team: Team };

const HeaderCreateBookmarkButton = ({ team }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'b' && event.ctrlKey) {
      setIsDialogOpen(true);
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button
          className="btn-add-link"
          aria-label="New bookmark"
          title="New bookmark"
        >
          <span className="hidden md:block">New bookmark</span>
          <PlusIcon className="h-3.5 w-3.5" aria-hidden="true" />
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

export default HeaderCreateBookmarkButton;
