import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import { ChangeEvent, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FIELDS } from './form-data';

interface IProps {
  avatar?: string;
  name?: string;
  teamId?: string;
}
export default function AvatarField({ avatar, name, teamId }: IProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const { control, setValue } = useFormContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    onChange: (file: File | null) => void
  ) => {
    const selectedFile = event.target.files?.[0] || null;
    onChange(selectedFile); // Update the form state
    if (selectedFile) {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 ">
      <p className="font-semibold">Avatar</p>
      <fieldset className="flex gap-4">
        <Controller
          name="avatar-upload"
          control={control}
          defaultValue={null}
          render={({ field: { onChange, value } }) => (
            <>
              <Avatar
                size="2xl"
                // Display preview or fallback avatar
                src={file ? URL.createObjectURL(file) : avatar}
                name={name}
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <label htmlFor="avatar-upload" className="sr-only">
                  Avatar
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, onChange)} // Pass onChange from Controller
                  className="hidden"
                  aria-label="Upload avatar"
                />
                <Button variant="outline" onClick={handleClick}>
                  Change
                </Button>
                <Button
                  variant="destructiveGhost"
                  onClick={(e) => {
                    e.preventDefault();
                    setValue(FIELDS.avatarUpload, null);
                    setValue(FIELDS.avatar, null);
                    setFile(null);
                  }}
                >
                  Remove
                </Button>
              </div>
            </>
          )}
        />
      </fieldset>
    </div>
  );
}
