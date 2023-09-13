import { useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import AddTextBlockDialog from './dialog/AddTextBlockDialog';
import { useParams } from 'next/navigation';
import { useTeam } from '@/contexts/TeamContext';

const AddTextBlockButton = ({ position }: { position: number }) => {
  const params = useParams();
  const [isAddTextDialogOpen, setIsAddTextDialogOpen] = useState(false);
  const { id: teamId } = useTeam();

  return (
    <div>
      <div className="group w-full cursor-pointer">
        <div className="block group-hover:hidden h-6" />
        <div className="hidden group-hover:block">
          <div
            className="flex items-center"
            onClick={() => setIsAddTextDialogOpen(true)}
          >
            <div className="bg-violet-500 w-full h-0.5 flex-1"></div>
            <PlusCircleIcon className="h-6 w-6 text-violet-500" />
            <div className="bg-violet-500 w-full h-0.5 flex-1"></div>
          </div>
        </div>
      </div>

      <AddTextBlockDialog
        isOpen={isAddTextDialogOpen}
        setIsOpen={setIsAddTextDialogOpen}
        digestId={params?.digestId as string}
        teamId={teamId}
        position={position + 1}
      />
    </div>
  );
};

export default AddTextBlockButton;
