'use client';

import { FormEvent, useState } from 'react';
import Button from '../../Button';
import { Dialog, DialogContent, DialogTrigger } from '../../Dialog';
import { useRouter } from 'next/navigation';
import useCustomToast from '@/hooks/useCustomToast';
import { useMutation } from 'react-query';
import api from '@/lib/api';
import { Input } from '../../Input';
import { DigestBlock, DigestBlockType, Team } from '@prisma/client';
import { AxiosError } from 'axios';
import { CreateBlockData } from '@/pages/api/teams/[teamId]/digests/[digestId]/block';

const CreateTemplateModal = ({
  team,
  templateBlocks,
}: {
  team: Team;
  templateBlocks: CreateBlockData[]; // only template blocks
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();
  const { errorToast, successToast } = useCustomToast();

  // find type for useMutation
  const { mutate: saveTemplate, isLoading } = useMutation<
    any,
    AxiosError,
    {
      title: string;
      digestBlocks: CreateBlockData[];
      isTemplate: boolean;
    }
  >(
    'save-digest-template',
    (data) => api.post(`/teams/${team.id}/template`, data),
    {
      onSuccess: () => {
        successToast('Your template has been saved');
        setIsDialogOpen(false);
        router.refresh();
      },
      onError: (error: any) => {
        if (error.response.data.error) {
          errorToast(error.response.data.error);
        } else {
          errorToast('Something went wrong...');
        }
      },
    }
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const templateTitle = e.currentTarget.template.value as string;
    if (!templateTitle) return;
    saveTemplate({
      title: `${team?.slug}-template-${templateTitle}`,
      digestBlocks: templateBlocks,
      isTemplate: true,
    });
  };

  if (!templateBlocks?.length) return null;
  return (
    <div className="py-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="link" size="sm">
            save as template
          </Button>
        </DialogTrigger>
        <DialogContent
          containerClassName="w-full sm:max-w-md"
          title="New Digest Template"
          description="Save your digest text blocks as a template to reuse it as a layout for your next publications"
          closeIcon
        >
          <form
            className="w-full bg-gray-50 flex flex-col gap-4"
            onSubmit={onSubmit}
          >
            <label htmlFor="template" className="hidden" aria-hidden="true">
              template
            </label>
            <Input
              type="text"
              name="template"
              id="template"
              placeholder="Digest template name"
              required
              autoFocus
            />
            <Button isLoading={isLoading} type="submit">
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTemplateModal;
