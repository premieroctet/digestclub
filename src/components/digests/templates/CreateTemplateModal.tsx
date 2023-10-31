'use client';

import { FormEvent, useState } from 'react';
import Button from '../../Button';
import { Dialog, DialogContent, DialogTrigger } from '../../Dialog';
import { useRouter } from 'next/navigation';
import useCustomToast from '@/hooks/useCustomToast';
import { useMutation } from 'react-query';
import api from '@/lib/api';
import { Input } from '../../Input';
import { DigestBlock, Team } from '@prisma/client';

const CreateTemplateModal = ({
  team,
  digestBlocks,
}: {
  team: Team;
  digestBlocks: DigestBlock[];
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();
  const { errorToast, successToast } = useCustomToast();

  const { mutate: saveTemplate, isLoading } = useMutation(
    'save-digest-template',
    (title: string) =>
      api.post(`/teams/${team.id}/digests`, {
        title: `${team?.slug}-template-${title}`,
        digestBlocks,
        isTemplate: 'true',
      }),
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
    const template = e.currentTarget.template.value;
    if (!template) return;
    saveTemplate(template);
  };

  if (!digestBlocks?.length) return null;
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
