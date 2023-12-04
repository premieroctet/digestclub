import { ChangeEvent } from 'react';
import Button from '../../../Button';
import { Input } from '../../../Input';
interface Props {
  onSend: () => void;
  isLoading: boolean;
  email: string;
  setEmail: (email: string) => void;
  label?: string;
}
export default function InvitationForm({
  onSend,
  isLoading,
  email,
  setEmail,
  label,
}: Props) {
  return (
    <div className="flex w-full">
      <form
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
          if (email) {
            onSend();
          }
        }}
      >
        <fieldset className="group w-full flex flex-col gap-2">
          <label htmlFor="email" className="font-bold sr-only">
            Email
          </label>

          <div className="mt-2 w-full">
            <div className=" flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 pr-0">
              <Input
                placeholder="Email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                type="email"
                id="email"
                autoFocus
                className="flex-1 pl-4 rounded-r-none"
              />
              <Button
                type="submit"
                isLoading={isLoading}
                style={{
                  borderTopLeftRadius: '0',
                  borderBottomLeftRadius: '0',
                  boxShadow: 'none',
                }}
              >
                {label}
              </Button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
