import { Team } from '@prisma/client';
import { FaTelegramPlane } from '@react-icons/all-files/fa/FaTelegramPlane';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '../Dialog';
import { BookmarkModal } from './BookmarkModal';

type Props = { team: Team };

const HeaderBookmarkButton = ({ team }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'b' && event.ctrlKey) {
      setIsDialogOpen(true);
    }
  }

  useEffect(() => {
    window.addEventListener('keypress', onKeyDown);
    return () => {
      window.removeEventListener('keypress', onKeyDown);
    };
  }, []);

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

export default HeaderBookmarkButton;
