import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import { useRef } from 'react';

interface IProps {
  avatar?: string;
  name?: string;
}
export default function AvatarField({ avatar, name }: IProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onAvatarChange(file: File) {}
  function onAvatarRemove() {}

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAvatarChange?.(file);
    }
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onAvatarRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2 ">
      <label htmlFor="avatar" className="font-semibold">
        Avatar
      </label>
      <fieldset className="flex gap-4">
        <Avatar size="2xl" src="/og-cover.png" name={name} />
        <div className="flex flex-col items-center justify-center  gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload avatar"
          />
          <Button variant="outline" onClick={handleClick}>
            Change
          </Button>
          <Button variant="destructiveGhost">Remove</Button>
        </div>
      </fieldset>
    </div>
  );
}
