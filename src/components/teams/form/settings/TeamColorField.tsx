import { Team } from '.prisma/client';
import Button from '@/components/Button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/Dialog';
import { Input } from '@/components/Input';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useFormContext } from 'react-hook-form';
import TeamAvatar from '../../TeamAvatar';

const TeamColorField = ({
  label,
  id,
  team,
}: {
  label: string;
  id: string;
  team: Partial<Team>;
}) => {
  const [color, setColor] = useState(team?.color ?? '#6D28D9');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  return (
    <fieldset
      aria-invalid={!!errors[id]}
      className="group w-full flex flex-col gap-2 items-stretch"
    >
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>

      <div className="mt-2 w-full">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className="flex gap-2 cursor-pointer">
              <TeamAvatar team={{ ...team, color }} />
              <Input
                {...register(id)}
                placeholder="Pick a color"
                className="pl-4 py-2 cursor-pointer"
              />
            </div>
          </DialogTrigger>
          <DialogContent
            containerClassName="w-full sm:max-w-md "
            title="Pick team color"
            closeIcon
          >
            <div className="flex-col flex gap-2">
              <HexColorPicker color={color} onChange={setColor} />
              <Button
                onClick={() => {
                  setValue(id, color, { shouldDirty: true });
                  setIsDialogOpen(false);
                }}
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {!!errors[id] && (
          <p className="mt-3 text-sm leading-6 text-red-500">
            {errors[id]?.message?.toString()}
          </p>
        )}
      </div>
    </fieldset>
  );
};

export default TeamColorField;
