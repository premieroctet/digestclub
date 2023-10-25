import Button from '@/components/Button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/Dialog';
import { Digest, Team } from '@prisma/client';
import { useState } from 'react';
import { DigestCreateInput } from '../DigestCreateInput';
import { TeamDigestsResult } from '@/lib/queries';

const SelectTemplateModal = ({
  team,
  templates,
  predictedDigestTitle,
}: {
  templates: TeamDigestsResult[];
  team: Team;
  predictedDigestTitle: string | null;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex justify-end">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="link">Use template</Button>
        </DialogTrigger>
        <DialogContent
          containerClassName="w-full sm:max-w-md"
          title="Create templated digest"
          description="Create a new digest using one of your templates"
          closeIcon
        >
          <div className="flex flex-col gap-4 w-full">
            <DigestCreateInput
              team={team}
              predictedDigestTitle={predictedDigestTitle}
              templates={templates}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SelectTemplateModal;
