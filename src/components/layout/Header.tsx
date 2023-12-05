import { routes } from '@/core/constants';
import { Team } from '@prisma/client';
import { Session } from 'next-auth';
import Link from 'next/link';
import Button from '../Button';
import Logo from './Logo';
import NavList from './NavList';
import { NavMenu } from './NavMenu/NavMenu';

type Props = { teams?: Team[]; user?: Session['user'] };

export default function Header({ teams, user }: Props) {
  return (
    <div className="flex items-center bg-white relative z-50">
      <div className="max-w-screen-xl w-full p-2 mx-auto flex justify-between items-center">
        <div className="flex flex-row gap-8 items-center">
          <Link className="hidden sm:flex" href={routes.HOME}>
            <Logo />
          </Link>
          <NavList />
        </div>
        <div className=" flex flex-row items-center">
          {user && teams && <NavMenu teams={teams} />}
          {!user && (
            <Link href={routes.LOGIN}>
              <Button type="button" variant="ghost">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
